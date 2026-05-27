import { error, json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { faq } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Fractional Indexing을 사용하여 두 priority 값 사이의 중간값을 계산합니다.
 * @param prev 이전 priority 값 (null이면 -1000으로 처리)
 * @param next 다음 priority 값 (null이면 1000으로 처리)
 * @returns 계산된 priority 값
 */
function calculatePriority(prev: number | null, next: number | null): number {
	const prevValue = prev ?? -1000;
	const nextValue = next ?? 1000;
	return (prevValue + nextValue) / 2;
}

/**
 * Priority 값들이 너무 좁아졌는지 확인합니다 (floating point 정밀도 고려)
 */
function isRangeTooNarrow(prev: number | null, next: number | null): boolean {
	const prevValue = prev ?? -1000;
	const nextValue = next ?? 1000;
	return Math.abs(nextValue - prevValue) < 1e-10;
}

/**
 * FAQ 목록의 priority를 재정렬합니다 (범위가 너무 좁아진 경우 사용)
 */
function resetPriorities(count: number): number[] {
	const step = 2000 / (count + 1);
	const priorities: number[] = [];
	for (let i = 0; i < count; i++) {
		priorities.push(-1000 + step * (i + 1));
	}
	return priorities;
}

export const POST = async ({ request, platform }) => {
	if (!platform) {
		return error(500, 'Platform not available');
	}

	const { faqs } = (await request.json()) as { faqs: string[] };
	const db = getDb(platform.env.DB);

	if (faqs.length === 0) {
		return json({ success: true });
	}

	try {
		// priority 기준으로 정렬하고, priority가 같으면 createdAt 순으로 정렬
		const allFaqs = await db
			.select()
			.from(faq)
			.orderBy((f) => [f.priority, f.createdAt]);

		// ID를 기준으로 기존 priority 맵 생성
		const prevPriorityMap = new Map(allFaqs.map((f) => [f.id, f.priority]));

		// 업데이트할 항목들 (변경이 필요한 것만)
		const updates: Array<{ id: string; priority: number }> = [];
		let needsReset = false;

		for (let i = 0; i < faqs.length; i++) {
			const id = faqs[i];
			const prevPriority = prevPriorityMap.get(id);

			// 이전 위치의 priority
			const prevPosition =
				i > 0 ? (updates[i - 1]?.priority ?? prevPriorityMap.get(faqs[i - 1]) ?? null) : null;

			// 다음 위치의 priority
			const nextPosition = i < faqs.length - 1 ? (prevPriorityMap.get(faqs[i + 1]) ?? null) : null;

			// 범위가 너무 좁아졌는지 확인
			if (isRangeTooNarrow(prevPosition, nextPosition)) {
				needsReset = true;
				break;
			}

			const newPriority = calculatePriority(prevPosition, nextPosition);

			// 실제로 변경되었을 때만 추가
			if (prevPriority !== newPriority) {
				updates.push({ id, priority: newPriority });
			}
		}

		// 범위가 너무 좁으면 전체 재정렬
		if (needsReset) {
			const resetPrioritiesList = resetPriorities(faqs.length);
			for (let i = 0; i < faqs.length; i++) {
				const id = faqs[i];
				const prevPriority = prevPriorityMap.get(id);
				const newPriority = resetPrioritiesList[i];

				if (prevPriority !== newPriority) {
					updates.push({ id, priority: newPriority });
				}
			}
		}

		// 변경사항 적용
		for (const { id, priority } of updates) {
			await db.update(faq).set({ priority, updatedAt: new Date() }).where(eq(faq.id, id));
		}
	} catch (err) {
		console.error('FAQ reorder error:', err);
		return error(500, 'Failed to reorder FAQs');
	}

	return json({ success: true });
};

import { error } from '@sveltejs/kit';

export const POST = async ({ request, platform }) => {
	if (!platform) {
		return error(500, '서버에 문제가 발생했습니다. 다시 시도해주세요.');
	}

	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof Blob)) {
		return error(400, '유효한 파일이 업로드되지 않았습니다.');
	}

	try {
		const fileName = `${Date.now()}-${file.name}`;
		await platform.env.BUCKET.put(fileName, file, {
			httpMetadata: {
				contentType: file.type
			}
		});

		return new Response(JSON.stringify({ url: `images/${fileName}` }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('이미지 업로드 중 오류 발생:', err);
		return error(500, '이미지 업로드에 실패했습니다. 다시 시도해주세요.');
	}
};

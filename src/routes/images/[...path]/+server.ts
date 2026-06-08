import { error } from '@sveltejs/kit';

export const GET = async ({ platform, params }) => {
	if (!platform) {
		return error(500, '서버에 문제가 발생했습니다. 다시 시도해주세요.');
	}

	const { path } = params;

	try {
		const image = await platform.env.BUCKET.get(path);

		if (!image) {
			return error(404, '이미지를 찾을 수 없습니다.');
		}

		const headers = new Headers();

		if (image.httpMetadata?.contentType) {
			headers.set('Content-Type', image.httpMetadata.contentType);
		}

		if (image.httpMetadata?.cacheControl) {
			headers.set('Cache-Control', image.httpMetadata.cacheControl);
		}

		return new Response(image.body, {
			headers
		});
	} catch (err) {
		console.error('이미지 조회 중 오류 발생:', err);
		return error(500, '이미지를 불러오는 데 실패했습니다. 다시 시도해주세요.');
	}
};

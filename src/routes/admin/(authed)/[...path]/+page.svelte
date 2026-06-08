<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { format } from 'date-fns';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Separator } from '$lib/components/ui/separator';

	let { data } = $props();

	const allArticleCount = $derived(data.allArticleCount);
	const publishedArticleCount = $derived(data.publishedArticleCount);
	const draftArticleCount = $derived(data.draftArticleCount);
	const latestArticles = $derived(data.latestArticles);
</script>

<div class="container mx-auto space-y-4 p-4">
	<section class="space-y-4">
		<h1 class="text-xl font-bold">게시글</h1>
		<h2 class="text-lg font-semibold">통계</h2>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card.Root>
				<Card.Header>
					<Card.Title>총 게시글</Card.Title>
					<Card.Description>총 게시글 수를 표시합니다.</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>{allArticleCount}</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>게시된 게시글</Card.Title>
					<Card.Description>게시된 게시글 수를 표시합니다.</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>{publishedArticleCount}</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>임시 저장된 게시글</Card.Title>
					<Card.Description>임시 저장된 게시글 수를 표시합니다.</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>{draftArticleCount}</p>
				</Card.Content>
			</Card.Root>
		</div>
	</section>
	<Separator />
	<Tooltip.Provider>
		<section class="space-y-4">
			<h2 class="text-lg font-semibold">최근 게시글</h2>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>제목</Table.Head>
						<Table.Head>상태</Table.Head>
						<Table.Head>작성일</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each latestArticles as article (article.id)}
						<Table.Row
							class="cursor-pointer"
							onclick={() => {
								goto(resolve(`/admin/(authed)/articles?id=${article.id}`));
							}}
						>
							<Table.Cell>{article.title}</Table.Cell>
							<Table.Cell>{article.status}</Table.Cell>
							<Table.Cell>
								<Tooltip.Root>
									<Tooltip.Trigger>
										{format(new Date(article.createdAt), 'yyyy-MM-dd')}
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>
											{format(new Date(article.createdAt), 'yyyy-MM-dd HH:mm:ss')}
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</section>
	</Tooltip.Provider>
</div>

<script lang="ts">
	import { untrack } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { signInSchema } from './schema';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import Password from '$lib/components/password.svelte';

	let { data } = $props();

	const { form, errors, enhance, constraints } = superForm(
		untrack(() => data.form),
		{
			validators: valibotClient(signInSchema)
		}
	);
</script>

<div class="flex min-h-screen items-center justify-center">
	<form method="POST" class="w-full max-w-md" use:enhance>
		<Card.Root>
			<Card.Header>
				<Card.Title>관리자 로그인</Card.Title>
				<Card.Description>관리자 계정에 로그인하세요</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col gap-6">
					<div class="flex flex-col gap-2">
						<Label for="username">아이디</Label>
						<Input name="username" bind:value={$form.username} {...$constraints.username} />
						{#if $errors.username}
							<p class="text-sm text-red-500">{$errors.username}</p>
						{/if}
					</div>
					<div class="flex flex-col gap-2">
						<Label for="password">비밀번호</Label>
						<Password name="password" bind:value={$form.password} {...$constraints.password} />
						{#if $errors.password}
							<p class="text-sm text-red-500">{$errors.password}</p>
						{/if}
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex-col gap-2">
				<Button type="submit" class="w-full">로그인</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>

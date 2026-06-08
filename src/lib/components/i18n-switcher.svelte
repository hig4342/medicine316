<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '$lib/components/ui/button';
	import LanguagesIcon from '@lucide/svelte/icons/languages';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon', class: 'cursor-pointer' })}
	>
		<LanguagesIcon />
		<span class="sr-only">Switch language</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-min">
		<DropdownMenu.RadioGroup bind:value={getLocale, setLocale}>
			{#each locales as locale (locale)}
				{@const localeName = new Intl.DisplayNames([locale], { type: 'language' }).of(locale)}
				<DropdownMenu.RadioItem value={locale}>
					{localeName}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>

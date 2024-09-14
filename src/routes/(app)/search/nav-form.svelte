<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Icon } from 'svelte-awesome';
	import { formSchema, type FormSchema } from '../../(website)/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { search } from 'svelte-awesome/icons';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData } = form;
</script>

<form method="GET" data-sveltekit-reload>
	<Form.Field {form} name="q">
		<Form.Control let:attrs>
			<div class="flex">
				<Input
					{...attrs}
					bind:value={$formData.q}
					class="md:flex-grow"
					placeholder={'Belarte...'}
				/>
				<Form.Button class="ml-2 bg-transparent" variant={'ghost'}>
					<Icon data={search} class="text-primary" />
				</Form.Button>
			</div>
		</Form.Control>
	</Form.Field>
</form>

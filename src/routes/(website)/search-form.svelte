<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="query">
		<Form.Control let:attrs>
			<Form.Label>Search</Form.Label>
			<div class="md:flex">
				<Input
					{...attrs}
					bind:value={$formData.query}
					class="bg-secondary md:flex-grow"
					autofocus={true}
				/>
				<Form.Button class="ml-4 hidden md:inline">Submit</Form.Button>
			</div>
		</Form.Control>
		<Form.Description>What kind of playlists are you looking for?</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<div class="flex items-center justify-center md:hidden">
		<Form.Button class="w-full md:w-auto">Submit</Form.Button>
	</div>
</form>

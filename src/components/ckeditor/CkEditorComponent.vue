<template>
	<div class="main-container">
		<div
			class="editor-container editor-container_document-editor editor-container_include-pagination"
			ref="editorContainerElement"
		>
			<div class="editor-container__menu-bar" ref="editorMenuBarElement"></div>
			<div class="editor-container__toolbar" ref="editorToolbarElement"></div>
			<div class="editor-container__editor-wrapper">
				<div class="editor-container__editor">
					<div ref="editorElement">
						<ckeditor
							v-if="editor && config"
							v-model="localData"
							:editor="editor"
							:config="config"
							@ready="onReady"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NoDgNARATAdAnDADBSBGEUDsrG4GwAsAzEanqkdnrogYkSAanLYSAKztTtFycWYodFBACmAOxREwwVGDmJ5SxAF1IQgIYAzbgCMIKoA=
 */

import { computed, ref, onMounted, watch, watchEffect, useTemplateRef } from 'vue';
import {
	DecoupledEditor,
	Autosave,
	Essentials,
	Paragraph,
	Alignment,
	AutoImage,
	AutoLink,
    ImageBlock,
	Bold,
	Code,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	HorizontalLine,
	ImageCaption,
	ImageEditing,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	ImageUtils,
	ImageInline,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	PageBreak,
	PasteFromOffice,
	RemoveFormat,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TodoList,
	Underline,
	ImageInsert,
	BalloonToolbar
} from 'ckeditor5';
import {
	Footnotes,
	LineHeight,
	MultiLevelList,
	Pagination,
	TableOfContents
} from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['update:modelValue']);

const LICENSE_KEY = import.meta.env.VITE_CKEDITOR_LICENSE_KEY;

const editorToolbar = useTemplateRef('editorToolbarElement');
const editorMenuBar = useTemplateRef('editorMenuBarElement');

const isLayoutReady = ref(false);
const localData = ref(props.modelValue);

const editor = DecoupledEditor;

const config = computed(() => {
	if (!isLayoutReady.value) {
		return null;
	}

	return {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'previousPage',
				'nextPage',
				'|',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'underline',
				'|',
				'link',
				'insertImage',
				'insertTable',
				'|',
				'alignment',
				'lineHeight',
				'|',
				'bulletedList',
				'numberedList',
				'multiLevelList',
				'todoList',
				'outdent',
				'indent'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			Alignment,
			AutoImage,
			AutoLink,
			Autosave,
			BalloonToolbar,
			Bold,
			Code,
			Essentials,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			Footnotes,
			Heading,
			HorizontalLine,
			ImageBlock,
			ImageCaption,
			ImageEditing,
			ImageInline,
			ImageInsert,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			ImageUtils,
			Indent,
			IndentBlock,
			Italic,
			LineHeight,
			Link,
			LinkImage,
			List,
			ListProperties,
			MultiLevelList,
			PageBreak,
			Pagination,
			Paragraph,
			PasteFromOffice,
			RemoveFormat,
			Strikethrough,
			Subscript,
			Superscript,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableOfContents,
			TableProperties,
			TableToolbar,
			TodoList,
			Underline,
		],
		balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		image: {
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			],
			upload: {
				types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
			}
		},
		licenseKey: LICENSE_KEY,
		lineHeight: {
			supportAllValues: true
		},
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		pagination: {
			pageWidth: '21cm',
			pageHeight: '29.7cm',
			pageMargins: {
				top: '20mm',
				bottom: '20mm',
				right: '12mm',
				left: '12mm'
			}
		},
		placeholder: 'Type or paste your content here!',
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		}
	};
});

watch(
	() => props.modelValue,
	newVal => {
		if (newVal !== localData.value) {
			localData.value = newVal;
		}
	}
);

watch(
	localData,
	newVal => {
		emit('update:modelValue', newVal);
	}
);

onMounted(() => {
	isLayoutReady.value = true;
});

watchEffect(() => {
	if (config.value) {
		configUpdateAlert(config.value);
	}
});

function onReady(editor) {
	[...editorToolbar.value.children].forEach(child => child.remove());
	[...editorMenuBar.value.children].forEach(child => child.remove());

	editorToolbar.value.appendChild(editor.ui.view.toolbar.element);
	editorMenuBar.value.appendChild(editor.ui.view.menuBarView.element);

	// Add custom upload adapter with better error handling
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
		return {
			upload: () => {
				return loader.file.then(file => new Promise((resolve, reject) => {
					// Check file size (max 2MB per image)
					// MongoDB has 16MB document limit, so keep images small
					const maxSize = 2 * 1024 * 1024; // 2MB
					if (file.size > maxSize) {
						reject('File size exceeds 2MB. Please compress or choose a smaller image.');
						return;
					}

					// Check file type
					if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp|bmp)$/)) {
						reject('Only image files (JPEG, PNG, GIF, WebP, BMP) are allowed.');
						return;
					}

					// Convert to Base64
					const reader = new FileReader();
					reader.onload = () => {
						resolve({
							default: reader.result
						});
					};
					reader.onerror = () => {
						reject('Error reading file. Please try again.');
					};
					reader.readAsDataURL(file);
				}));
			},
			abort: () => {
				// Optional: Handle abort
			}
		};
	};
}

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config) {
	if (configUpdateAlert.configUpdateAlertShown) {
		return;
	}

	const isModifiedByUser = (currentValue, forbiddenValue) => {
		if (currentValue === forbiddenValue) {
			return false;
		}

		if (currentValue === undefined) {
			return false;
		}

		return true;
	};

	const valuesToUpdate = [];

	configUpdateAlert.configUpdateAlertShown = true;

	if (!isModifiedByUser(config.licenseKey, '<YOUR_LICENSE_KEY>')) {
		valuesToUpdate.push('LICENSE_KEY');
	}

	if (valuesToUpdate.length) {
		window.alert(
			[
				'Please update the following values in your editor config',
				'to receive full access to Premium Features:',
				'',
				...valuesToUpdate.map(value => ` - ${value}`)
			].join('\n')
		);
	}
}
</script>

<template>
	<div class="tinymce-editor"><editor style="height:400px" v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"></editor></div>
</template>
<script>
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import { Message } from 'element-ui';
import uploadFile from '../../api/demo/demo';
// import a from "../../../public/tinymce/plugins/axupimgs"
import Vue from 'vue';
import axios from 'axios';
import lrz from 'lrz';
import 'tinymce/themes/silver';
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'; // 插入上传图片插件
import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/media';
import 'tinymce/plugins/link';
// import "tinymce/plugins/advtable";
import 'tinymce/plugins/code';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/emoticons';
import '../../../public/tinymce/plugins/axupimgs';
export default {
	components: {
		Editor
	},
	props: {
		value: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		plugins: {
			type: [String, Array],
			default: ''
		},
		toolbar: {
			type: [String, Array]
		}
	},
	data() {
		return {
			init: {
				forced_root_block: '',
				draggable_modal: true,
				// mode: "textareas",
				selector: 'textarea',
				// /account 
				language_url: '/account/tinymce/langs/zh_CN.js',
				language: 'zh_CN',
				skin_url: '/account/tinymce/skins/ui/oxide',
				autoresize_min_height: 350,
				resize: 'both',
				// skin_url: '/tinymce/skins/ui/oxide',//暗色系
				// height: 500,
				powerpaste_word_import: 'merge', // 是否保留word粘贴样式  clean | merge
				//   "forecolor backcolor lists advlist print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize lineheight formatpainter axupimgs",
				emoticons_append: {
					diy1: {
						keywords: ['diy1'],
						char: '\uD83E\uDD2F',
						category: 'animals_and_nature'
					}
				},
				plugins: 'emoticons lists charmap image axupimgs  batchUploadImage  table fullscreen autoresize print preview media  code link',
				toolbar:
					'emoticons axupimgs bullist numlist fullscreen code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
    table charmap image  batchUploadImage undo redo | link media | charmap emoticons hr pagebreak insertdatetime print preview  ',
				fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
				font_formats:
					'微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
				branding: false,
				menubar: true,
				images_upload_handler: this.uploadFile,
				// 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
				// 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
				images_upload_handler: (blobInfo, success, failure) => {
					var xhr,formData;
					var file = blobInfo.blob(); //转化为易于理解的file对象
					xhr = new XMLHttpRequest();
					xhr.withCredentials = false;
					xhr.open('POST', '/api/file/upload');
					let that=this
					xhr.onload = function() {
						let res = JSON.parse(xhr.response);
						if (res.status == 'success') {
							that.$message({
								message: '上传成功',
								type: 'success',
								center: true
							});
							let url = that.$itsoftUI.config.fileServer + res.data.path;
							console.log(url)
							that.imgString += url;
							success(url);
						} else {
							that.$message({
								message: '上传失败',
								type: 'error',
								center: true
							});
							failure('');
						}
					};
					formData = new FormData();
					formData.append('file', file, file.name);
					formData.append('system', 'account');
					xhr.send(formData);
					lrz(blobInfo.blob(), {
						quality: 0.7
					}).then(res => {
						// axios.post('/api/file/upload', formData).then(res => {
						// 	if (res.data.status == 'success') {
						// 		this.$message({
						// 			message: '上传成功',
						// 			type: 'success',
						// 			center: true
						// 		});
						// 		let url = this.$itsoftUI.config.fileServer + res.data.data.path;
						// 		this.imgString += url;
						// 		success(url);
						// 	} else {
						// 		this.$message({
						// 			message: '上传失败',
						// 			type: 'error',
						// 			center: true
						// 		});
						// 		failure('');
						// 	}
						// });
						
					});
				},
				file_picker_types: 'file media', // 指定允许上传的类型
				file_picker_callback: function(callback, value, meta) {
					if (meta.filetype == 'file') {
						// // 要先模拟出一个input用于上传本地文件
						var input = document.createElement('input');
						input.setAttribute('type', 'file');
						// 你可以给input加accept属性来限制上传的文件类型
						// 例如：input.setAttribute('accept', '.jpg,.png')
						input.setAttribute('accept', '.doc,.docx,.ppt,.pptx,.pdf,.xlsx');
						input.click();
						// let fileUrl = this.$itsoftUI.config.fileServer;
						input.onchange = function() {
							var file = this.files[0];
							const formData = new FormData();
							formData.append('file', file, file.name);
							formData.append('system', 'account');

							axios.post('/api/file/upload', formData).then(res => {
								if (res.data.status == 'success') {
									Message({
										message: '上传成功',
										type: 'success',
										center: true
									});
									let url = Vue.prototype.$itsoftUI.config.fileServer + res.data.data.path;
									// this.imgString += url;
									// success(url);
									callback(url, { title: file.name });
								} else {
									that.$message({
										message: '上传失败',
										type: 'error',
										center: true
									});
									// failure("");
								}
							});
						};
					}
					if (meta.filetype == 'media') {
						//创建一个隐藏的type=file的文件选择input
						let input = document.createElement('input');
						input.setAttribute('type', 'file');
						input.setAttribute('accept', '.avi,.baimov,.rmvb,.rm,.flv,.mp4,.3gp');
						input.onchange = function() {
							let file = this.files[0];
							let size = file.size / 1024 / 1024;
							if (size > 200) {
								Message({
									message: '视频大小不得超过200M',
									type: 'error',
									center: true
								});
							}
							var xhr, formData;
							xhr = new XMLHttpRequest();
							xhr.open('POST', '/api/file/upload');
							// xhr.withCredentials = self.credentials;
							xhr.upload.onprogress = function(e) {
								// 进度(e.loaded / e.total * 100)
								let percent = (e.loaded / e.total) * 100;
								if (percent < 100) {
									tinymce.activeEditor.setProgressState(true); //是否显示loading状态：1（显示）0（隐藏）
								} else {
									tinymce.activeEditor.setProgressState(false);
								}
							};
							xhr.onerror = function() {
								tinymce.activeEditor.setProgressState(false);
								return;
							};
							xhr.onload = function() {
								let json;
								if (xhr.status < 200 || xhr.status >= 300) {
									return;
								}

								json = JSON.parse(xhr.responseText);
								console.log(json);
								//假设接口返回JSON数据为{status: 0, msg: "上传成功", data: {location: "/localImgs/1546434503854.mp4"}}
								if (json.status == 'success') {
									//接口返回的文件保存地址
									let mediaLocation = Vue.prototype.$itsoftUI.config.fileServer + json.data.path;
									//cb()回调函数，将mediaLocation显示在弹框输入框中
									callback(mediaLocation, { title: file.name });
								} else {
									console.log(json.msg);
									return;
								}
							};
							formData = new FormData();
							//假设接口接收参数为file,值为选中的文件
							formData.append('file', file);
							formData.append('system', 'account');
							//正式使用将下面被注释的内容恢复
							xhr.send(formData);
						};
						//触发点击
						input.click();
					}
				}
			},
			myValue: this.value
		};
	},
	mounted() {
		tinymce.init({});
	},
	methods: {
		// 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
		// 需要什么事件可以自己增加
		onClick(e) {
			this.$emit('onClick', e, tinymce);
		},
		// 可以添加一些自己的自定义事件，如清空内容
		clear() {
			this.myValue = '';
		}
	},
	watch: {
		value(newValue) {
			this.myValue = newValue;
		},
		myValue(newValue) {
			this.$emit('input', newValue);
		}
	}
};
</script>
<style lang="scss" scoped>
.tinymce-editor {
	::v-deep .tox-tinymce {
		// height: 400px !important;
		min-height: 400px;
	}
}
</style>

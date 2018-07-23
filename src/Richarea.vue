<template>
    <div class="rich-area">

        <div ref="text" style="display:none" v-if="!initdone"><slot></slot></div>
        
        <textarea ref="input" :style="{width:width,height:height}" v-model="val"></textarea>

        <picker-modal class="picker-modal" v-model="mopen" ref="modal" @opened="mopened" @closed="mclosed" @cancel="mcancel">

            <span slot="title"><slot name="title">{{ filepickerTitle }}</slot></span>

            <div v-if="mopen" ref="picker">
                <iframe v-if="filepicker===true" ref="pickerframe" :src="pickersrc"></iframe>
            </div>

            <div slot="modal-footer" class="modal-footer"></div>

        </picker-modal>

    </div>
</template>

<script>

    import tinymce from 'tinymce';
    import 'tinymce/themes/modern/theme';
    import _ from 'lodash';
    import Modal from './Modal.vue';
    // import plugins
    import 'tinymce/plugins/paste';
    import 'tinymce/plugins/link';
    import 'tinymce/plugins/save';
    import 'tinymce/plugins/image';
    import 'tinymce/plugins/media';
    import 'tinymce/plugins/table';
    import 'tinymce/plugins/code';

    export default {

        components : {
            pickerModal : Modal,
        },

        mounted : function() {
            // message-listener
            window.addEventListener("message", this.insert, false);
            // set picker url
            if (this.filepicker === true) {
                this.pickerurl = 'https://' + window.location.host.split(':')[0] + '/filemanager/files';
                //console.log(this.pickerurl)
            } else if (_.isString(this.filepicker)) {
                this.pickerurl = this.filepicker;
            }
            // initialize?
            if (this.noinit) {
                return;
            }
            // init tinymce
            this.inittinymce();
            // debug
            //console.log(tinymce.majorVersion + '.' + tinymce.minorVersion);
          },

         props : {
            width : { type : String, default : '' },
            height : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            // tinymce config vars
            assetUrl : { type : String, default : ''},          // base url for skins und langs
            init : { type: Object },                            // tinymce init-vars
            noinit : { type : Boolean, default: false },        // prevent outomatic init
            save : { type: Function, default: null },           // Callable Save-Function
            filepicker : { default: null },                     // Callable File-Manager oder Boolean true für this.picker()
            filepickerTitle : { type: String, default : 'File-Picker'},
            filepickerinsert : { type : Function, default : null },
            parent : { type: String, default : 'parent' },

         },

        data : function() {
            return {
                initdone : false,
                val : '',
                editor : null,
                mopen : false,
                pickerurl : '',
                pickersrc : '',
                insertcallback : null,
                meta : null,
                value : null
            }
        },

        watch : {

          
        },

        computed : {
            
        },

        methods : {
             inittinymce() {
                // init vars
                var initvars = this.init || {};
                //initvars.selector = 'textarea#' + this.selectorid;
                initvars.target = this.$refs.input;
                initvars.branding = false;
                if (this.assetUrl !== '') {
                    var skin = this.init.skin || 'lightgray';
                    initvars.skin_url = this.assetUrl + 'skins/' + skin;
                    this.init.language ? initvars.language_url = this.assetUrl + 'langs/' + this.init.language + '.js' : null;
                }
                // save
                if (this.save) {
                    if ( ! /\bsave\b/.test(initvars.plugins)) {
                        initvars.plugins += ', save';
                    }
                    if ( ! /\bsave\b/.test(initvars.toolbar)) {
                        initvars.toolbar = 'save | ' + initvars.toolbar;
                    }
                    // disable by default
                    initvars.save_enablewhendirty = initvars.save_enablewhendirty || false;
                    initvars.save_onsavecallback = (() => { this.save(this.editor); });
                }
                // file
                if (this.filepicker) {
                    initvars.file_picker_types = 'image, media, file';
                    if (this.filepicker === true) {
                        initvars.file_picker_callback = this.picker;
                    } else {
                        initvars.file_picker_callback = this.filepicker;
                    }
                }
                // setup
                initvars.setup = this.setuptinymce;
                //console.log(initvars);
                // edit-mode oder placeholder (if any)
                this.setContent(this.$refs.text.innerHTML || this.placeholder);
                this.initdone = true;
                this.$nextTick(function() {
                    tinymce.init(initvars);
                });
            },
            setContent(content) {
                this.val = content;
            },
            setEditorContent(content) {
                if (this.editor) {
                    this.editor.setContent(content);
                }
            },
            setuptinymce(editor) {
                // editor speichern
                this.editor = editor;
                // focus
                editor.on('init',() => { editor.focus() });
                // blur, keyup, esc-key
                editor.on('blur',(event) => { this.$emit('blur',editor.getContent(),event) });
                editor.on('change',(event) => { this.$emit('change',editor.getContent(),event) });
                editor.on('keyup',(event) => { this.$emit('change',editor.getContent(),event) });
                editor.on('keydown',(event) => { 
                    if (event.key === "Escape") {
                        this.$emit('esc');
                    }
                });
            },
            picker(callback, value, meta) {
                this.meta = meta;
                this.value = value;
                this.insertcallback = callback;

                // set iframe-src and open modal
                this.pickersrc = this.pickerurl + '?context=' + this.parent + '&type=' + this.meta.filetype;
                this.mopen = true;
            },
            insert(event) {
                if (event.data.type && _.startsWith(this.pickerurl,event.origin)) {

                    // insert command
                    if (event.data.type != 'Filemanager-insert') {
                        return;
                    }

                    let icon = event.data.icon;

                    // Provide file and text for the link dialog
                    if (this.meta.filetype == 'file') {
                      this.insertcallback(icon.downurl, { text : icon.description, title : icon.description });
                    }

                    // Provide image and alt text for the image dialog
                    if (this.meta.filetype == 'image') {
                        // check viewable
                        if (icon.type != 1) {
                            return this.sendMessage('wrongtype');
                        }
                        this.insertcallback(icon.file, { alt : icon.description });
                    }

                    // Provide alternative source and posted for the media dialog
                    if (this.meta.filetype == 'media') {
                        // check mediable
                        if (icon.type != 2) {
                            return this.sendMessage('wrongtype');
                        }
                        this.insertcallback(icon.file, { 
                            // source2: 'alt.ogg', 
                            // poster: 'image.jpg'
                        } );
                    }

                    this.mopen = false;
                }

            },
            sendMessage(type) {
                if (this.$refs.pickerframe.contentWindow) {
                    this.$refs.pickerframe.contentWindow.postMessage(
                        { type: 'Filemanager-message', message : type}, this.pickerurl);
                }
            },
            mopened() {

            },
            mclosed() {

            },
            mcancel() {

            },
         },

    }
</script>

<style lang="scss">

    .picker-modal {

        &.modal {
            display:none;
            z-index:100000;
        }

        .modal-dialog {
            width:98%;
            height:96%;
            margin-top:15px;

            .modal-content {

                height:100%;

                .modal-body {

                    div {
                        height:100%;
                        iframe {
                            border:0;
                            width:100%;
                            height:100%;
                            position:relative;
                        }
                    }
                    
                }
            }
        }

        .modal-body {
            height:88%;
        }

        .modal-footer {
        }
        
         
    }

 </style>
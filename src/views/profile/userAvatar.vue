<template>
    <div>
        <img
            :src="options.img"
            title="点击上传头像"
            class="img-circle img-lg"
            @click="editCropper()"
        />
        <el-dialog :title="title" :visible.sync="open" width="800px">
            <el-row>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <vue-cropper
                        ref="cropper"
                        :img="options.img"
                        :info="true"
                        :auto-crop="options.autoCrop"
                        :auto-crop-width="options.autoCropWidth"
                        :auto-crop-height="options.autoCropHeight"
                        :fixed-box="options.fixedBox"
                        @realTime="realTime"
                    />
                </el-col>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <div class="avatar-upload-preview">
                        <img :src="previews.url" :style="previews.img" />
                    </div>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :lg="2" :md="2">
                    <el-upload
                        action="#"
                        :http-request="requestUpload"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                    >
                        <el-button size="small">
                            上传
                            <i class="el-icon-upload el-icon--right" />
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :lg="{ span: 1, offset: 2 }" :md="2">
                    <el-button icon="el-icon-plus" size="small" @click="changeScale(1)" />
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)" />
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()" />
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()" />
                </el-col>
                <el-col :lg="{ span: 2, offset: 6 }" :md="2">
                    <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import { uploadAvatar } from "@/api/admin/sys-user";
import { reactive, defineComponent, toRefs, getCurrentInstance } from "vue";
import { useStore } from "vuex";
export default defineComponent({
    components: { VueCropper },
    props: {
        user: { type: Object },
    },
    setup() {
       let store =useStore()
        let state = reactive({
            // 是否显示弹出层
            open: false,
            // 弹出层标题
            title: "修改头像",
            options: {
                img: store.getters.avatar, // 裁剪图片的地址
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 200, // 默认生成截图框宽度
                autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
            },
            previews: {},
        });

        let {ctx} =getCurrentInstance();
        // 编辑头像
        let editCropper = () => {
            state.open = true;
        };
        // 覆盖默认的上传行为
        let requestUpload = () => {};
        // 向左旋转
        let rotateLeft = () => {
          ctx.$refs.cropper.rotateLeft();
        };
        // 向右旋转
        let rotateRight = () => {
          ctx.$refs.cropper.rotateRight();
        };
        // 图片缩放
        let changeScale = (num) => {
            num = num || 1;
            ctx.$refs.cropper.changeScale(num);
        };
        let msgError=(msg)=>{}
        let msgSuccess=(msg)=>{}
        // 上传预处理
        let beforeUpload = (file) => {
            if (file.type.indexOf("image/") === -1) {
                msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    state.options.img = reader.result;
                };
            }
        };
        // 上传图片
        let uploadImg = () => {
            ctx.$refs.cropper.getCropBlob((data) => {
                const formData = new FormData();
                formData.append("upload[]", data);
                uploadAvatar(formData).then((response) => {
                    if (response.code === 200) {
                        state.open = false;
                        state.options.img = process.env.VUE_APP_BASE_API + response.data;
                        msgSuccess(response.msg);
                    } else {
                        msgError(response.msg);
                    }
                    ctx.$refs.cropper.clearCrop();
                });
            });
        };
        // 实时预览
        let realTime = (data) => {
            state.previews = data;
        };
        return {
          ...toRefs(state),
          realTime,
          uploadImg,
          beforeUpload,
          msgError,
          msgSuccess,
          changeScale,
          rotateRight,
          rotateLeft,
          requestUpload,
          editCropper
        };
    },
});
</script>

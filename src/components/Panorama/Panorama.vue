<template>
  <div class="container">
    <div class="row m-3">
      <div class="col-12">
        <div class="col-10 md:col-5">
          <div class="p-inputgroup my-2">
            <span class="p-inputgroup-addon"> Scene name </span>
            <InputText v-model="sceneName" />
          </div>
        </div>

        <div class="col-10 md:col-5 my-2">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon"> Scene name </span>
            <Dropdown v-model="selectedImage" :options="images" />
          </div>
        </div>

        <Button class="my-2" @click="addScene" label="Add scene" />
      </div>
      <div v-if="loadPanorama" class="col-12 d-flex overflow-auto h-100">
        <div
          class="d-flex flex-column"
          v-for="scene in scenesArray(src)"
          :key="scene.value.name"
        >
          <img
            :src="scene.value.src"
            class="img-thumbnail scene-image"
            :alt="scene.value.name"
            @click="handleClickImage(scene.value)"
          />
          <div class="d-flex align-items-center">
            <span class="mx-2">{{ scene.value.name }}</span>
            <Button
              @click="handleDeleteScene(scene.value)"
              icon="pi pi-times"
              class="p-button-rounded p-button-danger delete-icon mx-2"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row panorama-wrapper m-3" v-if="loadPanorama">
      <div class="col-12 d-flex">
        <VuePannellum
          :src="src"
          ref="pannellum"
          @click.right="handleRightClick"
          id="panorama"
        />
        <Dialog v-model:visible="displayDialog">
          <template #header>
            <h3>Add hotspot</h3>
          </template>
          <div>
            <div class="col-10 md:col-5 my-2">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon"> Hotspot type </span>
                <Dropdown
                  v-model="hotSpotType"
                  optionLabel="label"
                  :options="[
                    { value: 'info', label: 'Info' },
                    { value: 'scene', label: 'Sene' },
                  ]"
                />
              </div>
            </div>

            <div class="col-10 md:col-5">
              <div class="p-inputgroup my-2">
                <span class="p-inputgroup-addon"> Pitch </span>
                <InputNumber type="number" v-model="pitch" disabled />
              </div>
            </div>

            <div class="col-10 md:col-5">
              <div class="p-inputgroup my-2">
                <span class="p-inputgroup-addon"> Yaw </span>
                <InputNumber v-model="yaw" disabled />
              </div>
            </div>

            <div class="col-10 md:col-5">
              <div class="p-inputgroup my-2">
                <span class="p-inputgroup-addon"> Title </span>
                <InputText v-model="infoTitle" />
              </div>
            </div>

            <div v-if="selectedTypeIsScene" class="col-10 md:col-5 my-2">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon"> Scene </span>
                <Dropdown
                  optionLabel="label"
                  :modelValue="selectedScene"
                  :options="scenesArray(src)"
                />
              </div>
            </div>
          </div>
          <template #footer>
            <Button @click="setHotspot" label="Add" icon="pi pi-plus" />
          </template>
        </Dialog>
      </div>

      <div class="col-4 mt-3">
        <Button @click="savePanorama" label="Save all" />
      </div>
    </div>
    <div class="row mt-1 mb-4">
      <div class="col-12 panorama-wrapper">
        <VuePannellum
          :title="'Panorama'"
          :src="savedPanorama"
          v-if="savedPanorama"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VuePannellum from "vue-pannellum";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import PannellumSrc from "@/models/PannellumSrc";
import type PannellumScene from "@/models/PannellumScene";
import HotSpotType from "@/models/HotSpotType";

const images = ref([
  "../src/assets/19h1n3v-a-360-image-of-boat.jpeg",
  "../src/assets/n7s0cvh-360-panorama-miami-downtown.jpeg",
  "../src/assets/sb0criu-360-panorama-shore.jpeg",
]);

const selectedImage = ref("");
const yaw = ref(0);
const pitch = ref(0);
const infoTitle = ref("");
const hotSpotType = ref<HotSpotType>();
const selectedScene = ref("");
const sceneName = ref("");
const loadPanorama = ref(false);
const savedPanorama = ref();
const displayDialog = ref(false);
const src = ref(new PannellumSrc());
const pannellum = ref();

const scenesArray = (src: PannellumSrc) => {
  return Object.values(src.scenes).map((scene: PannellumScene) => {
    return {
      label: src.scenes[scene.name].name,
      value: scene,
    };
  });
};

const selectedTypeIsScene = computed(() => {
  if (hotSpotType.value) {
    return hotSpotType.value.value === "scene";
  }
  return false;
});

function handleRightClick(e: Event) {
  displayDialog.value = true;
  const cords = pannellum.value.viewer.mouseEventToCoords(e);
  pitch.value = cords[0];
  yaw.value = cords[1];
}

function setHotspot() {
  pannellum.value.viewer.addHotSpot({
    pitch: pitch.value,
    yaw: yaw.value,
    type: hotSpotType.value?.value,
    text: infoTitle.value,
    sceneId: selectedScene.value,
  });

  pitch.value = 0;
  yaw.value = 0;
  hotSpotType.value = new HotSpotType();
  infoTitle.value = "";
  selectedScene.value = "";

  displayDialog.value = false;
}

function savePanorama() {
  // get the whole src what we edited (includes the hotspots). this can be pass the api to save
  savedPanorama.value = pannellum.value.src;
  console.log(savedPanorama.value);
}

function addScene() {
  const newScene = {
    defaultSceneName: {
      name: sceneName.value,
      type: "equirectangular",
      src: selectedImage.value,
      panorama: selectedImage.value,
    },
  };
  const keyName = sceneName.value;
  src.value.default.firstScene = keyName;
  newScene[keyName] = newScene.defaultSceneName;
  delete newScene.defaultSceneName;
  Object.assign(src.value.scenes, newScene);
  loadPanorama.value = true;
  sceneName.value = "";
  selectedImage.value = "";
}

function handleClickImage(scene: PannellumScene) {
  src.value.default.firstScene = scene.name;
  pannellum.value.viewer.loadScene(scene.name);
}

function handleDeleteScene(scene: PannellumScene) {
  delete src.value.scenes[scene.name];
}
</script>
<style>
.panorama-wrapper {
  height: 1000px;
}
.scene-image {
  width: 200px;
  height: 200px;
  cursor: pointer;
}
.delete-icon {
  height: 8px !important;
  width: 8px !important;
  padding: 10px !important;
}
</style>

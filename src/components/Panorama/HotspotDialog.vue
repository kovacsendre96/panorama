<template>
  <Dialog v-model:visible="displayDialog">
    <template #header>
      <h3>Add hotspot</h3>
    </template>
    <div>
      <div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupSelect01"
          >Hotspot type</label
        >
        <select
          v-model="hotSpotType"
          class="form-select"
          id="inputGroupSelect01"
        >
          <option value="info">Info</option>
          <option value="scene">Scene</option>
        </select>
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Pitch</span>
        <input type="number" disabled class="form-control" v-model="pitch" />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Yaw</span>
        <input type="number" disabled class="form-control" v-model="yaw" />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Title</span>
        <input type="text" class="form-control" v-model="infoTitle" />
      </div>
      <div v-if="hotSpotType === 'scene'" class="input-group mb-3">
        <div class="input-group mb-3">
          <label class="input-group-text" for="inputGroupSelect01">Scene</label>
          <select
            v-model="selectedScene"
            class="form-select"
            id="inputGroupSelect01"
          >
            <option
              v-for="scene in Object.values(src.scenes)"
              :value="scene.name"
              :key="scene.name"
            >
              {{ scene.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <template #footer>
      <Button @click="setHotspot" label="Add" icon="pi pi-plus" />
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";

const yaw = ref<String>();
const pitch = ref<String>();
const infoTitle = ref<String>();
const hotSpotType = ref<String>();

defineProps({
  displayDialog: {
    type: Boolean,
    defult: false,
  },
});
</script>

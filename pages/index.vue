<script setup lang="ts">
import type { RouterInput } from "~/plugins/trpc";

const { $trpc } = useNuxtApp();

const { data: posts } = await useAsyncData(() => $trpc.post.getAll.query());
console.log(posts.value);
console.log("tetststrtrt");
const { data: msg } = useLazyAsyncData(() =>
  $trpc.greeting.query({ name: "world" })
);

watch(msg, (msg) => {
  // eslint-disable-next-line no-console
  console.log(msg);
});

const showDialog = ref(false);
const rules = [(value: string) => !!value || "Required"];

const { data: hello } = useLazyAsyncData(() =>
  $trpc.greeting.query({ name: "what" })
);

console.log(hello);

const test: any = ref(null);

const form: RouterInput["post"]["create"] = reactive({
  title: "",
  description: "",
});

const createPost = async () => {
  const { valid } = await test.value.validate();
  if (valid) {
    const postCreated = await $trpc.post.create.mutate(form);
    posts.value?.push(postCreated);
    showDialog.value = false;
  }
};

const deletePost = async (index: number) => {
  const id = posts.value?.[index]?._id;

  console.log(id);
  if (id) await $trpc.post.delete.mutate({ id });
  posts.value?.splice(index, 1);
};
</script>

<template>
  <section>
    <v-col class="pa-6">
      <v-row>
        <v-spacer />
        <v-btn color="primary" @click="showDialog = true"> Create </v-btn>
      </v-row>
    </v-col>

    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Description</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="post.id">
          <!-- <td>{{ post }}</td> -->
          <td>{{ post.title }}</td>
          <td>{{ post.description }}</td>
          <!-- <td>{{ post.doc.title }}</td> -->

          <td class="text-right">
            <v-btn color="red" size="small" @click="deletePost(index)">
              delete
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="showDialog">
      <v-card>
        <v-card-title>
          <span class="text-h5">Create post</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="test">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.title"
                    label="Title"
                    :rules="rules"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.description"
                    label="Description"
                    :rules="rules"
                    required
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="showDialog = false">
            Close
          </v-btn>
          <v-btn color="primary" variant="text" @click="createPost">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

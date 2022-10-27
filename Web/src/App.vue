<template>
  <div id="app">
    <div class="container-fluid p-4">
      <div class="row">
        <div class="col-md-12">
          <h3 class="justify-content-start align-items-center d-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="red"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-alert-octagon"
            >
              <polygon
                points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"
              ></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span class="ms-2"> DDoS Attackers </span>
          </h3>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-12">
          <table
            class="
              table table-light table-striped table
              align-middle
              table-responsive
            "
          >
            <thead>
              <tr class="table-dark">
                <th scope="col">#</th>
                <th scope="col">IP</th>
                <th scope="col">Total de paquetes</th>
                <th scope="col">Fecha de Bloqueo</th>
                <th scope="col">Inicio de Ataque</th>
                <th scope="col">Fin de Ataque</th>
                <th scope="col">Duración(s)</th>
                <th scope="col">
                  <span class="d-flex justify-content-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-settings"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                      ></path>
                    </svg>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="align-items-center"
                v-for="(item, idx) in rows"
                :key="idx"
              >
                <th scope="row">{{ idx + 1 }}</th>
                <td>{{ item.ip }}</td>
                <td>{{ item.visitas }}</td>
                <td>{{ new Date(item.timestamp) }}</td>
                <td>{{ new Date(item.init_r) }}</td>
                <td>{{ new Date(item.last_r) }}</td>
                <td class="text-end">
                  {{ (item.last_r - item.init_r) / 1000 }}s
                </td>
                <td class="text-center">
                  <button
                    @click="enable(item.ip)"
                    class="btn btn-sm btn-success align-items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-check-circle"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Habilitar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data: () => {
    return {
      rows: [],
    };
  },
  components: {},
  methods: {
    getData() {
      axios
        .get(
          "https://f6tbgrcrz3mcfid2qnbsolvlfy0zyrnm.lambda-url.us-east-2.on.aws/"
        )
        .then((result) => {
          console.log(result.data);
          this.rows = result.data;
        });
    },
    enable(ip) {
      const url = `https://z6edh37scv7kneofy6mklethku0xvaar.lambda-url.us-east-2.on.aws/${ip}`;
      axios.delete(url).then(() => {
        alert("Ip eliminada del registro");
        this.getData();
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
</style>

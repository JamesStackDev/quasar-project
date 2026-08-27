import axiosService from "@/services/interceptors/Api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {
    const users = ref<{id: string, name: string}[]>([])


    const fetchUsers = async() => { 
        const res = await axiosService.get('/users')
        users.value = res.data
    }

    function getAuthorName(authorId: string): string {
        return users.value.find((u) => u.id === authorId)?.name ?? 'Unknown'
    }

    return { fetchUsers, getAuthorName}
})
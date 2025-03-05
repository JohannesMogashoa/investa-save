<template>
    <USlideover :ui="{ width: 'w-screen max-w-4xl' }">
        <div class="p-4 flex-1">
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
                class="flex sm:hidden absolute end-5 top-5 z-10" square padded @click="emit('update:isOpen', false)" />
            <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <h1 class="text-2xl font-bold">Transactions</h1>
                <UInput v-model="q" placeholder="Filter transactions..." />
            </div>

            <UTable :columns="columns" :rows="rows"></UTable>

            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="transactions.length" />
            </div>
        </div>
    </USlideover>
</template>

<script setup lang="ts">
import type { InvestecTransaction } from 'investec-api';

const { transactions } = defineProps<{
    transactions: InvestecTransaction[]
}>();

const emit = defineEmits(['update:isOpen']);

const page = ref(1)
const pageCount = 10
const q = ref('')

const columns = [
    {
        key: 'type',
        label: 'Type'
    },
    {
        key: 'transactionType',
        label: 'Transaction type',
        sortable: true
    }, {
        key: 'description',
        label: 'Description'
    }, {
        key: 'transactionDate',
        label: 'Date',
        sortable: true
    }, {
        key: 'amount',
        label: 'Amount',
        sortable: true
    }
]


const rows = computed(() => {
    if (!q.value) {
        return transactions.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }

    return transactions.filter((row) => {
        return Object.values(row).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
});



</script>
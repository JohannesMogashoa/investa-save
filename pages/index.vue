<template>
    <UContainer>
        <h1 class="h-6 text-3xl font-bold mb-6">Welcome to my accounts</h1>

        <div class="grid grid-cols-2 gap-3">
            <template v-for="account in accounts" :key="account.accountId" @click="selectAccount(account)">
                <div @click="() => selectAccount(account.accountId)">
                    <UCard :class="selectedAccount?.balance.accountId ==
                        account.accountId
                        ? 'border-2 border-white'
                        : ''
                        " class="cursor-pointer">
                        <h2>{{ account.accountName }}</h2>
                        <p>{{ account.accountNumber }}</p>
                        <p>{{ account.productName }}</p>
                    </UCard>
                </div>
            </template>
        </div>

        <div class="h-5" />

        <template v-if="selectedAccount">
            <div>
                <h2 class="text-xl font-semibold mb-3">Transaction Analysis</h2>
                <ul class="grid grid-cols-3 gap-3">
                    <UCard v-for="(analysis, type) in selectedAccount.transactionsAnalysis" :key="type">
                        <p class="text-xl">{{ type }}</p>
                        <p class="text-sm text-white/30"><span class="font-bold">Total Transactions:</span> {{
                            analysis.count }}</p>
                        <p class="text-sm text-white/30"><span class="font-bold">Total Amount: </span>{{
                            formatAmount(analysis.totalAmount) }}</p>
                    </UCard>
                </ul>
            </div>

            <div class="h-5" />

            <UCard class="flex justify-between">
                <div>
                    <p>
                        Current Balance:
                        {{ formatAmount(selectedAccount.balance.currentBalance) }}
                    </p>
                </div>
                <div>
                    <p>
                        Available Balance:
                        {{ formatAmount(selectedAccount.balance.availableBalance) }}
                    </p>
                </div>
            </UCard>

            <div class="h-5" />

            <div>
                <UTable :columns="columns" :rows="rows"></UTable>

                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                    <UPagination v-model="page" :page-count="pageCount" :total="selectedAccount.transactions.length" />
                </div>
            </div>
        </template>
    </UContainer>
</template>

<script setup lang="ts">
import type { AccountDetail } from "~/shared/types";

const { data: accounts } = await useFetch("/api/get-accounts");
const selectedAccount = useState<AccountDetail | null>("selectedAccount");

const page = ref(1)
const pageCount = 5

const rows = computed(() => {
    return selectedAccount.value?.transactions.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const selectAccount = async (accountId: string) => {
    if (selectedAccount.value?.balance.accountId === accountId) {
        selectedAccount.value = null;
        return;
    }

    const { data } = await useFetch(`/api/account/${accountId}`);

    selectedAccount.value = data.value;
};



const columns = [
    {
        key: 'transactionType',
        label: 'Transaction type'
    }, {
        key: 'description',
        label: 'Description'
    }, {
        key: 'transactionDate',
        label: 'Date'
    }, {
        key: 'amount',
        label: 'Amount'
    }
]

//format amount to currency
const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ZAR'
    }).format(amount)
}
</script>

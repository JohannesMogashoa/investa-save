<template>
    <h1 class="h-6 text-3xl font-bold mb-6">My Accounts</h1>

    <div class="grid grid-cols-2 gap-3">
        <template v-for="account in accounts" :key="account.accountId" @click="selectAccount(account)">
            <div @click="() => selectAccount(account.accountId)">
                <UCard :class="selectedAccount?.balance.accountId ==
                    account.accountId
                    ? ' border-4 border-primary'
                    : ''
                    " class="cursor-pointer">
                    <div class="flex justify-between">
                        <p>{{ account.accountNumber }}</p>
                        <p>{{ account.productName }}</p>
                    </div>
                </UCard>
            </div>
        </template>
    </div>

    <div class="h-5" />
    <UProgress color="primary" size="sm" v-if="isLoading" />

    <template v-if="selectedAccount">
        <div>
            <h2 class="text-xl font-semibold mb-3">Account Overview</h2>
            <UCard class="flex justify-between">
                <div class="mb-2">
                    <p>
                        Current Balance:
                        {{ formatAmount(selectedAccount.balance.currentBalance) }}
                    </p>
                </div>
                <div class="mb-2">
                    <p>
                        Available Balance:
                        {{ formatAmount(selectedAccount.balance.availableBalance) }}
                    </p>
                </div>
                <div class="mb-2">
                    <p>
                        Total Credits:
                        {{ formatAmount(selectedAccount.income) }}
                    </p>
                </div>
                <div>
                    <p>
                        Total Debits:
                        {{ formatAmount(selectedAccount.expenses) }}
                    </p>
                </div>
            </UCard>
            <div class="h-5" />
            <div class="flex justify-between w-full mb-3 items-center">
                <h2 class="text-xl font-semibold ">Transaction Analysis</h2>
                <UButton class=" bg-white/60" label="View Transactions"
                    @click="openTransactions(selectedAccount.transactions)" />
            </div>
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
    </template>
</template>

<script setup lang="ts">
import { AccountTransactionsSlideOut } from "#components";
import type { InvestecTransaction } from "investec-api";
import type { AccountDetail } from "~/shared/types";
const slideOver = useSlideover();

const { data: accounts } = await useFetch("/api/get-accounts");
const selectedAccount = useState<AccountDetail | null>("selectedAccount");
const isLoading = ref(false);

const openTransactions = (transactions: InvestecTransaction[]) => {
    slideOver.open(AccountTransactionsSlideOut, {
        transactions
    })
}

const selectAccount = async (accountId: string) => {
    if (selectedAccount.value?.balance.accountId === accountId) {
        selectedAccount.value = null;
        return;
    }

    isLoading.value = true;

    const { data } = await useLazyAsyncData('transactions', () => $fetch(`/api/account/${accountId}`));

    selectedAccount.value = data.value;
    isLoading.value = false;
};

//format amount to currency
const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ZAR'
    }).format(amount)
}
</script>

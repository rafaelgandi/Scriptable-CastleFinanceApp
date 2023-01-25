window.appData = {

    addAccount(data) {
        APP_DATA['accounts'].push(data);
        saveData();
    },

    getAccountByIden(iden) {
        let account = null;
        APP_DATA['accounts'].forEach((a) => {
            if (a.iden === iden) {
                account = a;
            }
        });
        return account;
    },

    sortTransactionsByTimestamp(transactions) {
        transactions.sort((a, b) => {
            if (a.timestamp < b.timestamp) {
                return 1;
            }
            if (a.timestamp > b.timestamp) {
                return -1;
            }
            return 0;
        });
        return transactions;
    },

    updateAccount(iden, data) {
        APP_DATA['accounts'].forEach((a, i) => {
            if (a.iden === iden) {
                APP_DATA['accounts'][i] = data;
                APP_DATA['accounts'][i]['transactions'] = appData.sortTransactionsByTimestamp(data.transactions);
            }
        });
        saveData();
    },

    deleteTransaction(accountIden, transactionIden) {
        let account = null;
        APP_DATA['accounts'].forEach((a, i) => {
            if (a.iden === accountIden) {
                APP_DATA['accounts'][i]['transactions'] = appData.sortTransactionsByTimestamp(a.transactions.filter((t) => {
                    return t.iden !== transactionIden;
                }));
                account = APP_DATA['accounts'][i];
            }
        });
        saveData();
        return account;
    },

    deleteAccount(accountIden) {
        APP_DATA['accounts'] = APP_DATA['accounts'].filter((a, i) => {
            return a.iden !== accountIden;
        });
        saveData();
    }

};
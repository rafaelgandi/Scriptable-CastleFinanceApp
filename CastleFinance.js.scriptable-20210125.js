// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// always-run-in-app: true; icon-color: deep-purple;
// icon-glyph: chess;


// Inspired by AssetWise app

const fm = FileManager.iCloud();
const htmlSourcePath = fm.documentsDirectory() + `/CastleFinance/index.html`;
const dbSourcePath = fm.documentsDirectory() + `/CastleFinance/db.json`;

await fm.downloadFileFromiCloud(htmlSourcePath);
await fm.downloadFileFromiCloud(dbSourcePath);
if (!fm.fileExists(dbSourcePath)) { 
    fm.writeString(dbSourcePath, '{}');
}

let rawDbData = fm.readString(dbSourcePath);
if (rawDbData.trim() === '') {
    rawDbData = '{}';
}

let APP_DATA = JSON.parse(rawDbData);
if (!('accounts' in APP_DATA)) {
    APP_DATA['accounts'] = [];
}

function saveData(appData) {
    fm.writeString(dbSourcePath, appData);
}

function ymd() {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    return `${y}-${m}-${d}`;
}

async function doBackup() {
    let data = fm.readString(dbSourcePath);
    data = ensureDataIntegrity(data);
    const backupDir = fm.documentsDirectory() + '/CastleFinance/backups/';
    if (!fm.isDirectory(backupDir)) {
        fm.createDirectory(backupDir);
    }
    const backupFile = backupDir + ymd() + '.bak.json';
    if (!fm.fileExists(backupFile)) {
        fm.writeString(backupFile, data);
    }
    fm.writeString(backupFile, data);
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

function ensureDataIntegrity(dataStr) {
    if (isJSON(dataStr)) {
        let data = JSON.parse(dataStr)
        if (!data?.accounts) {
            return JSON.stringify({accounts: []});
        }
        data.accounts = data.accounts
        .map((a) => {
            if (!a?.exFromTotal) {
                a.exFromTotal = false;
            }
            return a;
        })
        .filter((a) => {
            return !!(a?.iden);
        });
        return JSON.stringify(data);
    }
    else {
        return JSON.stringify({accounts: []});
    }
}

let htmlSource = fm.readString(htmlSourcePath);
htmlSource = htmlSource.replace('<<SCRIPTABLE>>', 'scriptable');
htmlSource = htmlSource.replace('"<<APP_DATA>>"', ensureDataIntegrity(JSON.stringify(APP_DATA)));
const wv = new WebView();
function watcher() {
    wv.evaluateJavaScript(`console.log('watcher activated...');`, true).then((appData) => {
        saveData(ensureDataIntegrity(appData));
        doBackup();
        watcher();       
    });
}
doBackup();
wv.loadHTML(htmlSource);
watcher();
// Make sure to call .present() last to avoid errors
wv.present(true).then(() => {
    doBackup();
});


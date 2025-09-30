import { customAlphabet } from 'nanoid';
import Wallet from '#models/wallet';
export function generateNanoId(length = 6) {
    const nanoId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
    return nanoId();
}
export async function generateUniqueWalletID() {
    let walletID;
    let exists;
    do {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        walletID = `${'W'}${randomNumber}`;
        exists = await Wallet.query().where('walletId', walletID).first();
    } while (exists);
    return walletID;
}
//# sourceMappingURL=generate_unique_id.js.map
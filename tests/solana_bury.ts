import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SolanaBury } from "../target/types/solana_bury";
// import idl from "../target/idl/solana_bury.json";
import { Keypair,
         PublicKey,
         SystemProgram,
         clusterApiUrl,
         Connection,
         LAMPORTS_PER_SOL
       } from "@solana/web3.js";

describe("solana_bury", () => {
  // Configure the client to use the local cluster.
  // test file
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolanaBury as Program<SolanaBury>;

  // client file
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  // const wallet = useAnchorWallet();
  // const provider = new AnchorProvider(connection, wallet, {});
  // setProvider(provider);
  // const program = new Program(idl as SolanaBury, {
  //   connection,
  // });

  const tester_pubkey = new PublicKey("2G1FuUFXviRVr4FX8H8eZtR2WmVBAdFxnUWrxBJDMGvp")
  const whose_tombstone = "Bennu"

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("test bury", async () => {
    // 測試埋葬指令
    let txHash;
    // 尋找墓碑pda位址
    const [bennu_tombstone_account] =
      PublicKey.findProgramAddressSync([
        Buffer.from("solana_bury_tombstone", "utf8"),
        Buffer.from("Bennu", "utf8"),
        tester_pubkey.toBuffer()
        ],
        program.programId
      );
    console.log(bennu_tombstone_account)
    // 呼叫埋葬指令
    txHash = await program.methods
      .bury(whose_tombstone)
      .accounts({
        tombstone_account: bennu_tombstone_account,
        celebrant: tester_pubkey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // 確認交易成功
    await logTransaction(txHash);
  });

  it("test worship", async () => {
    // 測試祭拜指令
    let txHash;
    // 尋找祝詞pda位址
    const [bennu_blessings_account] =
      PublicKey.findProgramAddressSync([
        Buffer.from("solana_bury_blessings", "utf8"),
        Buffer.from("Bennu", "utf8"),
        tester_pubkey.toBuffer()
        ],
        program.programId
      );
    console.log(bennu_blessings_account)
    // 呼叫祭拜指令
    let offering_count = new anchor.BN(1);
    txHash = await program.methods
      .worship(whose_tombstone, "R.I.P", offering_count)
      .accounts({
        blessings_account: bennu_blessings_account,
        worshipper: tester_pubkey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // 確認交易成功
    await logTransaction(txHash);
  });

  async function logTransaction(txHash) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: txHash,
    });
    console.log("solana confirm -v ", txHash)
  }

});

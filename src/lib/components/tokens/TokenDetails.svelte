<script lang="ts">
  import type { TokenData } from '$lib/types';

  import Modal from '$lib/components/layout/Modal.svelte';
  import TokenLogo from '$lib/components/tokens/TokenLogo.svelte';
  import AddressPill from '$lib/components/tokens/AddressPill.svelte';
  import CopyButton from '$lib/components/common/CopyButton.svelte';
  import ChainBadge from '$lib/components/tokens/ChainBadge.svelte';
  import UnderlyingTokenItem from '$lib/components/tokens/UnderlyingTokenItem.svelte';
  import { clearSelectedToken, selectToken } from '$lib/stores/tokenStore';
  import Button from '../common/Button.svelte';
  import {
    AppWindowMacIcon,
    ArrowLeft,
    ArrowRight,
    Code2Icon,
    CodeIcon,
    FileJson,
    FileJson2
  } from '@lucide/svelte';
  import FileJson_2 from '@lucide/svelte/icons/file-json-2';

  interface Props {
    token: TokenData;
    showOverlay?: boolean;
  }

  let { token }: Props = $props();
  const showOverlay = $derived(selectToken != null);

  let tokenReference = $derived({
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    primary: token.primaryAddress,
    underlyingTokens: token.underlyingTokens,
    protocol: token.protocolSlug
  });

  // Format TVL with appropriate suffix (K, M, B)
  function formatTVL(value: number): string {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(4)}`;
    }
  }

  function handleClose() {
    clearSelectedToken();
  }

  function happyPath(dir: 'to' | 'from') {
    window.open(route(dir, 'happypath'), '_blank');
  }

  function routeSdk(dir: 'to' | 'from') {
    navigator.clipboard.writeText(route(dir, 'sdk'));
  }

  function route(dir: 'to' | 'from', type: 'sdk' | 'happypath') {
    const tokenIn = dir === 'from' ? token.address : '';
    const tokenOut = dir === 'to' ? token.address : '';

    const chainIdFrom = token.chainId.toString();
    const chainIdTo = chainIdFrom;

    if (type == 'happypath') {
      return 'https://happypath.enso.build/?tokenIn=$TOKEN_IN&tokenOut=$TOKEN_OUT&outChainId=$TO_CHAIN_ID&chainId=$FROM_CHAIN_ID'
        .replaceAll('$TOKEN_IN', tokenIn)
        .replaceAll('$TOKEN_OUT', tokenOut)
        .replaceAll('$FROM_CHAIN_ID', chainIdFrom)
        .replaceAll('$TO_CHAIN_ID', chainIdTo);
    } else {
      return `import * as dotenv from "dotenv";
import { signEOA, signSmartWallet } from "./tools";
import { EnsoClient, RouteData } from "@ensofinance/sdk";

dotenv.config();
const ENSO_API_KEY = process.env.ENSO_API_KEY!;
const ensoClient = new EnsoClient({ apiKey: ENSO_API_KEY });

const tokenIn = "$TOKEN_IN";
const tokenOut = "$TOKEN_OUT";
const amountIn = "100000000";
const chainId = $FROM_CHAIN_ID;
const destinationChainid = $TO_CHAIN_ID;

const fromAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

(async function main() {
  const route: RouteData = await ensoClient.getRouteData({
    chainId,
    destinationChainId: chainId,
    amountIn: [amountIn],
    fromAddress,
    tokenIn: [tokenIn],
    tokenOut: [tokenOut],
    routingStrategy: "router",
    receiver: fromAddress,
    slippage: "500",
  });

  console.log(JSON.stringify(route, null, 2));

  // approval transaction for \`router\` strategy
  // see https://docs.enso.build/pages/build/reference/routing-strategies
  await signEOA(
    ensoClient.getApprovalData({
      chainId,
      fromAddress,
      amount: amountIn,
      tokenAddress: tokenIn,
    })
  );
  // sending the actual transaction
  await signEOA(route!.tx);
})();
`
        .replaceAll('$TOKEN_IN', tokenIn)
        .replaceAll('$TOKEN_OUT', tokenOut)
        .replaceAll('$FROM_CHAIN_ID', chainIdFrom)
        .replaceAll('$TO_CHAIN_ID', chainIdTo);
    }
  }

  function copyRef() {
    const jsonData = JSON.stringify(tokenReference, null, 2);
    navigator.clipboard.writeText(jsonData);
  }
</script>

<Modal show={showOverlay} on:close={handleClose} maxWidth="720px">
  {#snippet header()}
    <div class="flex items-center gap-4">
      <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} size="lg" />

      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 id="modal-title" class="text-text-primary m-0 text-xl font-semibold">
              {token.name || 'Unknown Token'}
            </h2>
            <span class="text-text-tertiary text-sm">{token.symbol || 'Unknown'}</span>
            <ChainBadge chainId={token.chainId} showLabel={false} />
          </div>
        </div>

        <!-- Metrics Pills -->
        <div class="mt-2 flex gap-3">
          <div class="flex items-center gap-1.5">
              <div
                class="rounded-full px-2.5 py-1 text-sm font-medium text-white"
              >
                #.{token.decimals}
              </div>
            </div>
          {#if token.apy !== null && token.apy !== undefined}
            <div class="flex items-center gap-1.5">
              <div
                class="from-primary to-secondary rounded-full bg-gradient-to-r px-2.5 py-1 text-sm font-medium text-white"
              >
                {token.apy.toFixed(4)}% APY
              </div>
              {#if token.apyBase !== null && token.apyReward !== null}
                <div class="text-text-tertiary text-xs">
                  ({token.apyBase?.toFixed(1)}% + {token.apyReward?.toFixed(1)}%)
                </div>
              {/if}
            </div>
          {/if}

          {#if token.tvl !== null && token.tvl !== undefined}
            <div
              class="bg-bg-hover text-text-primary border-brdr-light rounded-full border px-2.5 py-1 text-sm font-medium"
            >
              {formatTVL(token.tvl)} TVL
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet footer()}
    <div>
      <Button
        variant="ghost"
        on:click={copyRef}
        Icon={FileJson}
        title={JSON.stringify(tokenReference, null, 2)}>Info</Button
      >
      <Button variant="ghost" on:click={() => routeSdk('from')} Icon={CodeIcon}>SDK From</Button>
      <Button variant="ghost" on:click={() => routeSdk('to')} Icon={CodeIcon}>SDK To</Button>
      
      <Button variant="ghost" on:click={() => happyPath('from')} Icon={AppWindowMacIcon}
        >Happypath From</Button
      >
      <Button variant="ghost" on:click={() => happyPath('to')} Icon={AppWindowMacIcon}
        >Happypath To</Button
      >
    </div>
  {/snippet}
  <div class="modal-content">
    {#if token.project && token.protocolSlug}
      <div class="mb-5">
        <h3 class="text-text-primary m-0 mb-2 text-base font-semibold">Protocol</h3>
        <div class="flex items-center gap-2.5">
          <span class="bg-bg-component rounded-md px-3 py-1.5 text-sm font-medium"
            >{token.project}</span
          >
          <span class="text-text-tertiary text-sm">{token.protocolSlug}</span>
        </div>
      </div>
    {/if}

    <div class="mb-5">
      <h3 class="text-text-primary m-0 mb-2 text-base font-semibold">Token Address</h3>
      <AddressPill address={token.address} label="token address" />
    </div>

    {#if token.primaryAddress && token.primaryAddress !== token.address}
      <div class="mb-5">
        <h3 class="text-text-primary m-0 mb-2 text-base font-semibold">Primary Contract</h3>
        <AddressPill address={token.primaryAddress} label="primary contract address" />
      </div>
    {/if}

    {#if token.underlyingTokens && token.underlyingTokens.length > 0}
      <div class="underlying-tokens">
        <h3 class="text-text-primary m-0 mb-2 flex items-center gap-2 text-sm font-medium">
          Underlying Tokens ({token.underlyingTokens.length})
          <CopyButton
            text={token.underlyingTokens.map((t) => t.address).join('\n')}
            small={true}
            label="all underlying token addresses"
          />
        </h3>
        <div class="grid grid-cols-2 gap-2">
          {#each token.underlyingTokens as underlyingToken}
            <UnderlyingTokenItem token={underlyingToken} />
          {/each}
        </div>
      </div>
    {/if}
  </div>
</Modal>

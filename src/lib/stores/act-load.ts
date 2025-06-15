import { EnsoClient, type BundleAction } from '@ensofinance/sdk';

const AUTH_TOKEN: string = '56b3d1f4-5c59-4fc1-8998-16d001e277bc';

const ensoClient = new EnsoClient({ apiKey: AUTH_TOKEN });

type ActionsMap = { protocol: string; actions: BundleAction[] }[];

export async function loadActions() {
  let actionsMap: ActionsMap = [];

  const protocols = await ensoClient.getProtocolData();

  protocols.map(async (protocol) => {
    const t = {
      protocol: protocol.slug,
      actions: await ensoClient.getActionsBySlug(protocol.slug)
    };
    actionsMap = [...actionsMap];
  });

  console.log(JSON.stringify(actionsMap, null, 2));
}

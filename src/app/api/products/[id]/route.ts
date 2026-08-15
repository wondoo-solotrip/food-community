import { handleRoute, jsonOk } from '@/lib/api/response';
import { getProduct } from '@/lib/products';

/** GET /api/products/:id — 상품(강연·모임) 상세. 비공개·없는 상품은 404 다. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const { id } = await params;
    return jsonOk({ product: await getProduct(id) });
  });
}

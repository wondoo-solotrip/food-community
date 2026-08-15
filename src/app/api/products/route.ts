import { handleRoute, jsonOk } from '@/lib/api/response';
import { listProducts } from '@/lib/products';

/** GET /api/products — 공개 상품(강연·모임) 목록 */
export async function GET() {
  return handleRoute(async () => jsonOk({ products: await listProducts() }));
}

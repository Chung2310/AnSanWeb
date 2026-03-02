import { redirect } from 'next/navigation';

/**
 * Handle access to the base /danh-muc path.
 * Since the dynamic route [...slug] requires at least one segment,
 * this page catches the empty segment case and redirects to the all-products page.
 */
export default function DanhMucBasePage() {
  redirect('/danh-muc-san-pham');
}

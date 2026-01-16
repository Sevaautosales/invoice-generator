import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isMock = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

// --- Mock Supabase Implementation ---
class MockSupabase {
    private storageKey = 'seva_auto_sales_invoices';

    private getItems() {
        if (typeof window === 'undefined') return [];
        const items = localStorage.getItem(this.storageKey);
        return items ? JSON.parse(items) : [];
    }

    private saveItems(items: any[]) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    from(table: string) {
        return {
            select: (query: string = '*') => {
                const items = this.getItems();
                return {
                    order: (col: string, { ascending = false } = {}) => {
                        const sorted = [...items].sort((a, b) => {
                            const valA = a[col];
                            const valB = b[col];
                            return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
                        });
                        return Promise.resolve({ data: sorted, error: null });
                    },
                    eq: (col: string, val: any) => {
                        const filtered = items.filter((i: any) => i[col] === val);
                        return {
                            single: () => Promise.resolve({ data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found' } })
                        };
                    },
                    then: (resolve: any) => resolve({ data: items, error: null })
                };
            },
            insert: (data: any[]) => {
                const items = this.getItems();
                const newItems = data.map(item => ({
                    ...item,
                    id: item.id || Math.random().toString(36).substr(2, 9),
                    invoice_number: item.invoice_number || `SEVA-INV-${(items.length + 1).toString().padStart(5, '0')}`,
                    created_at: item.created_at || new Date().toISOString(),
                }));
                this.saveItems([...newItems, ...items]);
                return {
                    select: () => Promise.resolve({ data: newItems, error: null })
                };
            },
            delete: () => {
                return {
                    eq: (col: string, val: any) => {
                        const items = this.getItems();
                        const filtered = items.filter((i: any) => i[col] !== val);
                        this.saveItems(filtered);
                        return Promise.resolve({ data: null, error: null });
                    }
                };
            }
        };
    }
}

export const supabase = isMock
    ? (new MockSupabase() as any)
    : createClient(supabaseUrl, supabaseAnonKey);

if (isMock) {
    console.warn('Supabase credentials missing. Seva Auto Sales is running in MOCK MODE (localStorage).');
}

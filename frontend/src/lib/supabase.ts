import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isMock = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

// --- Mock Supabase Implementation ---
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
        const items = this.getItems();

        const queryBuilder = (data: any[]) => {
            let currentData = [...data];
            let countValue: number | null = data.length;

            const builder: any = {
                select: (columns: string = '*', options?: any) => {
                    return builder;
                },
                order: (col: string, { ascending = false } = {}) => {
                    currentData.sort((a, b) => {
                        const valA = a[col];
                        const valB = b[col];
                        return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
                    });
                    return builder;
                },
                eq: (col: string, val: any) => {
                    currentData = currentData.filter(i => i[col] === val);
                    return builder;
                },
                gte: (col: string, val: any) => {
                    currentData = currentData.filter(i => i[col] >= val);
                    return builder;
                },
                lte: (col: string, val: any) => {
                    currentData = currentData.filter(i => i[col] <= val);
                    return builder;
                },
                or: (filters: string) => {
                    // Simple mock implementation of ILIKE OR filters
                    // Format: "col1.ilike.%val%,col2.ilike.%val%"
                    const parts = filters.split(',');
                    currentData = currentData.filter(item => {
                        return parts.some(part => {
                            const [col, op, pattern] = part.split('.');
                            const searchVal = pattern.replace(/%/g, '').toLowerCase();
                            return String(item[col] || '').toLowerCase().includes(searchVal);
                        });
                    });
                    return builder;
                },
                range: (fromIdx: number, toIdx: number) => {
                    currentData = currentData.slice(fromIdx, toIdx + 1);
                    return builder;
                },
                limit: (n: number) => {
                    currentData = currentData.slice(0, n);
                    return builder;
                },
                single: () => {
                    return Promise.resolve({ data: currentData[0] || null, error: currentData[0] ? null : { message: 'Not found' } });
                },
                // Allow using as a promise
                then: (onfulfilled: any) => {
                    return Promise.resolve({ data: currentData, error: null, count: countValue }).then(onfulfilled);
                }
            };
            return builder;
        };

        return {
            select: (columns: string = '*', options?: any) => queryBuilder(items).select(columns, options),
            insert: (data: any[]) => {
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
            delete: () => ({
                eq: (col: string, val: any) => {
                    const filtered = items.filter((i: any) => i[col] !== val);
                    this.saveItems(filtered);
                    return Promise.resolve({ data: null, error: null });
                }
            })
        };
    }
}

export const supabase = isMock
    ? (new MockSupabase() as any)
    : createClient(supabaseUrl, supabaseAnonKey);

if (isMock) {
    console.warn('Supabase credentials missing. Seva Auto Sales is running in MOCK MODE (localStorage).');
}

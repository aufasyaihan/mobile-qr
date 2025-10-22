import { useCallback, useEffect, useState } from "react";

type AsyncFn<Args extends any[] = any[], R = any> = (...args: Args) => Promise<R>;

interface UseFetchOptions {
    immediate?: boolean;
}

export default function useFetch<Args extends any[] = any[], R = any>(
    asyncFn: AsyncFn<Args, R>,
    options: UseFetchOptions = { immediate: true }
) {
    const [data, setData] = useState<R | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(
        async (...args: Args): Promise<R | null> => {
            setLoading(true);
            setError(null);
            try {
                const res = await asyncFn(...args);
                // await new Promise((resolve) => setTimeout(resolve, 5000));
                // console.log("API response:", res);
                setData(res ?? null);
                return res ?? null;
            } catch (err: any) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [asyncFn]
    );

    useEffect(() => {
        if (options.immediate) {
            (execute as unknown as () => Promise<R | null>)();
        }
    }, [execute, options.immediate]);

    return { data, loading, error, execute, setError } as {
        data: R | null;
        loading: boolean;
        error: string | null;
        execute: (...args: Args) => Promise<R | null>;
        setError: (error: string | null) => void;
    };
}

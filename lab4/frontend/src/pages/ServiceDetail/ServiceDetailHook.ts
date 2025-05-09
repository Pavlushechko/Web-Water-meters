import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Service } from "../ServiceDetail/ServiceDetail";

export function ServiceDetailHook() {
    const { id } = useParams<{ id: string }>();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`/api/services/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error(`Ошибка загрузки услуги с id=${id}`);
                const data = await response.json();
                console.log('Полученные данные:', data); // Вот здесь видно owners
                setService(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchService();
        }
    }, [id]);

    return {
        service,
        loading,
        error,
    };
}

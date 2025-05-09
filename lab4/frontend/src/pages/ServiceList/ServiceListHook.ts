import { useState, useEffect } from "react";

export function ServiceListHook() {
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`/api/services/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error("Network error");
                const data = await response.json();
                setServices(data); 
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };

        fetchServices();
    }, []);

    return {
        services
    };
}

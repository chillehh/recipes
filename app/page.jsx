"use client"
import { getNetlifyContext } from 'utils';
import RecipeContent from 'components/content-loader';
import { useState, useEffect } from 'react';

const Loader = (columns) => (<RecipeContent columns={columns} />)

export default function Page() {
    const [columns, setColumns] = useState(5);

    useEffect(() => {
        const updateColumns = () => {
            setColumns(window.innerWidth < 640 ? 1 : 5);
        }
        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4">Recipes</h1>
                <Loader columns={columns} />
            </section>
        </div>
    );
}

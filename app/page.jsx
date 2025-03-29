import ListRecipes from 'components/list-recipes';
import CreateRecipeButton from 'components/create-recipe-button';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export default async function Page() {
    const session = await getServerSession(authOptions);

    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            {session ? (
                <CreateRecipeButton />
            ) : (
                <p>Please log in to create a recipe.</p>
            )}
            <section>
                <h1 className="mb-4">Recipes</h1>
                <ListRecipes/>
            </section>
        </div>
    );
}

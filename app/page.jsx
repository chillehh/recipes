import ListRecipes from 'components/list-recipes';
import CreateRecipeButton from 'components/create-recipe-button';

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <CreateRecipeButton/>
            <section>
                <h1 className="mb-4">Recipes</h1>
                <ListRecipes/>
            </section>
        </div>
    );
}

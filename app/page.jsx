import { getNetlifyContext } from 'utils';
import RecipeContent from 'components/content-loader';
import ListRecipes from 'components/list-recipes';

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4">Recipes</h1>
                <ListRecipes/>
            </section>
        </div>
    );
}

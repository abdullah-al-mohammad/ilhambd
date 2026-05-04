import { TbAdjustmentsHorizontal, TbLayoutCollage, TbMicrophone, TbSearch } from 'react-icons/tb';

export default function SearchForm() {
  return (
    <div className="container mx-auto px-4 mt-16 lg:mt-6">
      <div className="pt-3">
        <form action="#" className="relative flex gap-2">
          <div className="relative flex-1">
            <input
              className="input input-bordered w-full rounded-full bg-base-100 shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="search"
              placeholder="Search in ilham"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
            >
              <TbSearch className="w-5 h-5" />
            </button>
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary btn-circle text-white shadow-sm"
            >
              <TbAdjustmentsHorizontal className="w-5 h-5" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[100] menu p-2 mt-2 shadow-xl bg-base-100 rounded-box w-40 border border-base-200"
            >
              <li>
                <a>
                  <TbMicrophone className="w-4 h-4 mr-2" /> Voice
                </a>
              </li>
              <li>
                <a>
                  <TbLayoutCollage className="w-4 h-4 mr-2" /> Image
                </a>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

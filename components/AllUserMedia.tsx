interface Media {
  id: number;
  name: string;
  description?: string | null; // Allow null or undefined
  photo?: string | null;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface MediaByCategoryProps {
  categories: Category[];
  media: Media[];
}
const AllUserMedia: React.FC<MediaByCategoryProps> = ({
  categories,
  media,
}) => {
  return (
    <div className="p-1">
      {categories.map((category) => (
        <div key={category.id} className="mb-4">
          <h2 className="mb-4 text-2xl font-bold">{category.name}</h2>
          <div className="flex flex-nowrap gap-4 overflow-x-auto">
            {media
              .filter((item) => item.categoryId === category.id)
              .map((item) => (
                <a key={item.id} href={"/create/" + item.id}>
                  <div className="bg-secend w-36 flex-shrink-0 overflow-hidden rounded-xl shadow-xl">
                    {item.photo && (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="h-36 w-36 object-cover"
                      />
                    )}
                    <div className="p-1">
                      <h3 className="my-1 text-base font-semibold text-white">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllUserMedia;

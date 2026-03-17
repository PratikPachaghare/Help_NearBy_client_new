import { useCallback, useEffect, useMemo, useState } from 'react';
import './Home.css';
import SearchBar from '../componets/Home/SearchBar/Serchbar';
import CategoryFilter, { WORKER_CATEGORIES } from '../componets/Home/Category/CategoryFilter';
import WorkerCard from '../componets/Home/WorkerCard/WorkerCard';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2 } from '../componets/Loder/Loader';
import { apiCall } from '../../../utils/ApiCalls';
import { Endpoints } from '../../../utils/Endpiont';

const Home = () => {
  const navigate = useNavigate();
  const [workersData, setWorkersData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [keyword, setKeyword] = useState('');
  const [hasMore] = useState(false);

  const fetchWorkers = useCallback(async () => {
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const resp = await apiCall('GET', Endpoints.Workers?.List || '/workers', {}, params);
      setWorkersData(resp?.data || []);
    } catch (error) {
      console.error(error);
      setWorkersData([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchWorkers]);

  const SerachWorkers = (text) => {
    setKeyword(text || '');
  };

  const filteredWorkers = useMemo(() => {
    if (!keyword.trim()) return workersData;
    return workersData.filter((row) => {
      const name = row?.userId?.name || '';
      const categories = Array.isArray(row?.categories) ? row.categories.join(' ') : '';
      return `${name} ${categories}`.toLowerCase().includes(keyword.toLowerCase());
    });
  }, [workersData, keyword]);

  const categoryCards = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const source = WORKER_CATEGORIES.filter((category) => {
      if (!normalizedKeyword) return true;
      return category.toLowerCase().includes(normalizedKeyword);
    });

    return source.map((category) => {
      const matchingWorkers = workersData.filter((row) =>
        Array.isArray(row?.categories) && row.categories.some((c) => c?.toLowerCase() === category.toLowerCase())
      );

      return {
        category,
        workerCount: matchingWorkers.length,
        previewWorkers: matchingWorkers.slice(0, 5)
      };
    });
  }, [keyword, workersData]);

  return (
    <div className="home-container">
      <div className="worker-home-hero">
        <h2>Find Verified Local Experts</h2>
        <p>Browse reliable professionals with category filters and quick request flow.</p>
      </div>
      <div className="Seach-Category">
        <SearchBar SerachWorkers={SerachWorkers} fetchWorkers={fetchWorkers} />
        <div className="category-filter">
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
      </div>
      <div className="home-layout">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-5">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Choose Service Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryCards.map((row) => (
              <button
                key={row.category}
                onClick={() => navigate('sendRequest', { state: { category: row.category, availableWorkers: row.previewWorkers } })}
                className="text-left border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 transition"
              >
                <p className="font-semibold text-slate-800">{row.category}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {row.workerCount > 0 ? `${row.workerCount} workers available nearby` : 'No live profile yet, request will broadcast'}
                </p>
              </button>
            ))}
          </div>
        </div>

        <InfiniteScroll dataLength={filteredWorkers.length} next={() => {}} hasMore={hasMore} loader={<Loader2 />}>
          <div className="worker-list">
            {filteredWorkers.map((worker) => (
              <button
                key={worker._id}
                onClick={() => navigate('sendRequest', { state: { worker } })}
                style={{ textDecoration: 'none', background: 'transparent', border: 0, padding: 0, textAlign: 'left' }}
              >
                <WorkerCard worker={worker} />
              </button>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;

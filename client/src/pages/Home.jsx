import { useState, useEffect } from 'react'
import SummaryCard from '../components/common/SummaryCard';
import { useDispatch, useSelector } from 'react-redux';
import summaryApi from '../api/modules/summary.api';
import Spinner from '../components/common/Spinner';
import { setData } from '../redux/features/summarySlice';
import { toast } from 'react-toastify'
import PageTitle from '../components/common/PageTitle';

const Home = () => {
  const { summary } = useSelector(state => state.summary);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const { response, err } = await summaryApi.summary();
      setIsLoading(false);
      if (response) dispatch(setData(response.summary));

      if (err) toast.error(err.message);
    }

    getData();
  }, [dispatch]);
  return (
    <div className='section dashboard'>
      {isLoading ? (
        <div className='min-100 d-flex align-items-center justify-content-center'>
          <Spinner/>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-12">
            <PageTitle pageName={"Dashboard"} />
            <div className="row">
              <SummaryCard
                title="O'quvchilar"
                icon="people-fill"
                count={summary && summary.countStudents}
              />
              <SummaryCard
                title="Kurslar"
                icon="laptop-fill"
                count={summary && summary.countCourse}
              />
              <SummaryCard
                title="Kurs vaqtlari"
                icon="clock-fill"
                count={summary && summary.countCourseTime}
              />
              <SummaryCard
                title="Jami jo'natilgan xabarlar"
                icon="envelope-exclamation-fill"
                count={summary && summary.countSmsStatus}
              />
              <SummaryCard
                title="Xabar uchun shablonlar"
                icon="envelope-fill"
                count={summary && summary.countSmsTemplate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
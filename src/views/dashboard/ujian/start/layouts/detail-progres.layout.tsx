import { Drawer } from 'antd';
interface IPropsDetailProgressExam {
  openDetail: boolean
  setOpenDetail: () => void
  question: any
}
export default function DetailProgressExam(props: IPropsDetailProgressExam): React.JSX.Element {
  let questionCounter = 0;

  return (
    <Drawer
      width={400}
      title="Nomor Soal"
      placement="left"
      closable={false}
      onClose={props?.setOpenDetail}
      open={props?.openDetail}
      key="left"
    >
      <div>
        <div className='flex gap-2 items-center flex-wrap max-h-[340px] overflow-y-scroll w-full pb-2'>
          {
            props?.question?.sections?.map((section: any, idx: number) => (
              section?.vintages?.map((vintage: any, idxV: number) => (
                vintage?.questions?.map((question: any, idxQ: number) => {
                  questionCounter++
                  return (
                    <div key={idx} className='flex items-center justify-center w-12 h-12 shadow-lg rounded-full'>{questionCounter}</div>
                  )
                }
                )))))
          }
        </div>
        {/* <div className='flex gap-2 items-center flex-wrap max-h-[340px] overflow-y-scroll w-full pb-2'>
          {Array.from({ length: 100 }).map((item: any, idx: number) => (
            <div key={idx} className='flex items-center justify-center w-12 h-12 shadow-lg rounded-full'>{idx + 1}</div>
          ))}
        </div> */}
        <div className='mt-10'>
          <p>Keterangan : </p>
          <div className='mt-3'>
            <div className='flex gap-4 items-center'>
              <div className='w-3 h-3 rounded-full bg-[#ED7020]' />
              <p>Sudah Dijawab</p>
            </div>
            <div className='flex gap-4 items-center'>
              <div className='w-3 h-3 rounded-full bg-[#E6B595]' />
              <p>Dilewati</p>
            </div>
            <div className='flex gap-4 items-center'>
              <div className='w-3 h-3 rounded-full bg-[#007BFF]' />
              <p>Sedang Dikerjakan</p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
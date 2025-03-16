import { Button } from '@mui/material';
import portfolioStyles from "../../portfolio.module.scss";
import { translate } from '../../../../i18n';

export default function ModalNav({ page, setPage, maxPage, finishPage, onFinish }: { page: number; setPage: (v: number) => void, maxPage: number, finishPage: number, onFinish: () => void }) {
    const isFinish = page <= maxPage && page > finishPage - 2;
    return (
        <div className={portfolioStyles.modalNav}>
            <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>{translate["back"]}</Button>
            <Button onClick={() => isFinish ? onFinish() : setPage(page + 1)} disabled={page >= maxPage}>{isFinish ? translate["finish"] : translate["next"]}</Button>
        </div>
    )
}

import { Button, Card } from "./ui";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export const ConfirmDialog = ({ title, message, onCancel, onConfirm }: ConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <Card className="w-full max-w-sm">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button className="bg-slate-200 text-slate-900 hover:bg-slate-300" onClick={onCancel}>
            Avbryt
          </Button>
          <Button
            className="bg-rose-600 hover:bg-rose-500"
            onClick={async () => {
              await onConfirm();
              onCancel();
            }}
          >
            Ta bort
          </Button>
        </div>
      </Card>
    </div>
  );
};

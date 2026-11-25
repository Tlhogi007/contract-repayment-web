import { AppHeader } from './components/AppHeader';
import { AppIntro } from './components/AppIntro';
import { AuthPanel } from './components/AuthPanel';
import { ContractList } from './components/ContractList';
import { CreateContractForm } from './components/CreateContractForm';
import { EditDialog } from './components/EditDialog';
import { ScrollTopButton } from './components/ScrollTopButton';
import { Toast } from './components/Toast';
import { useAppIntro } from './hooks/useAppIntro';
import { useContracts } from './hooks/useContracts';
import { useSession } from './hooks/useSession';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { errorMessage } from './lib/errors';

export default function App(): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const { dismissToast, showError, showToast, toast } = useToast();
  const session = useSession({
    onError: showError,
    onMessage: showToast,
  });
  const showIntro = useAppIntro(!session.booting);
  const contracts = useContracts({
    enabled: session.hasToken && !showIntro,
    onError: session.handleApiError,
    onMessage: showToast,
  });

  const authError = session.error ? errorMessage(session.error) : null;
  const listError = contracts.error ? errorMessage(contracts.error) : null;

  // Auth failures stay inline on the form; list failures use ErrorState.
  // Toast covers mutations + session notices. Prefer explicit toast over notice.
  const toastMessage =
    toast?.message ??
    session.notice ??
    (session.hasToken && authError ? authError : null);

  if (showIntro) {
    return <AppIntro />;
  }

  return (
    <div className="app">
      <AppHeader
        email={session.email}
        signedIn={session.hasToken}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSignOut={() => {
          session.signOut();
        }}
      />

      <main>
        {!session.hasToken ? (
          <AuthPanel
            busy={session.authBusy}
            error={toast?.tone === 'error' ? toast.message : authError}
            onSubmit={async (mode, email, password) => {
              dismissToast();
              await session.signIn({ email, mode, password });
            }}
          />
        ) : (
          <div className="workspace">
            <CreateContractForm
              busy={contracts.createBusy}
              onCreate={contracts.create}
              onInvalid={showError}
            />
            <ContractList
              busy={contracts.busy}
              contracts={contracts.contracts}
              error={listError}
              loading={contracts.loading}
              nextCursor={contracts.nextCursor}
              onDelete={contracts.remove}
              onEdit={contracts.setEditing}
              onLoadMore={contracts.loadMore}
              onRefresh={contracts.refresh}
            />
          </div>
        )}
      </main>

      <ScrollTopButton />
      {!session.hasToken && toast?.tone === 'error' ? null : (
        <Toast
          message={toastMessage}
          tone={toast?.tone ?? (session.notice ? 'ok' : 'error')}
          onDismiss={() => {
            dismissToast();
            session.clearError();
            contracts.clearError();
          }}
        />
      )}
      <EditDialog
        busy={contracts.updateBusy}
        contract={contracts.editing}
        onClose={() => {
          contracts.setEditing(null);
        }}
        onSave={async (principalCents, expectedUpdatedAt) => {
          if (!contracts.editing) {
            return;
          }
          await contracts.update({
            expectedUpdatedAt,
            id: contracts.editing.id,
            principalCents,
          });
        }}
      />
    </div>
  );
}

'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateAccount } from '@/app/(login)/actions';
import { User } from '@/lib/db/schema';
import useSWR from 'swr';
import { Suspense } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

function AccountForm({
  state,
  nameValue = '',
  emailValue = ''
}: AccountFormProps) {
  return (
    <>
      <div>
        <Label htmlFor="name" className="mb-2">
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          defaultValue={state.name || nameValue}
          required
          autoComplete="name"
          aria-invalid={state.error ? "true" : "false"}
          aria-describedby={state.error ? "general-error" : "name-help"}
        />
        <p id="name-help" className="sr-only">
          Enter your full name as you'd like it to appear
        </p>
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          defaultValue={emailValue}
          required
          autoComplete="email"
          aria-invalid={state.error ? "true" : "false"}
          aria-describedby={state.error ? "general-error" : "email-help"}
        />
        <p id="email-help" className="sr-only">
          Enter a valid email address for account notifications
        </p>
      </div>
    </>
  );
}

function AccountFormWithData({ state }: { state: ActionState }) {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  return (
    <AccountForm
      state={state}
      nameValue={user?.name ?? ''}
      emailValue={user?.email ?? ''}
    />
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  return (
    <section className="flex-1 p-4 lg:p-8" aria-labelledby="general-page-title">
      <h1 id="general-page-title" className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={formAction} noValidate>
            <Suspense fallback={<AccountForm state={state} />}>
              <AccountFormWithData state={state} />
            </Suspense>
            
            <div className="space-y-2" role="region" aria-live="polite" aria-atomic="true">
              {state.error && (
                <div
                  id="general-error"
                  className="text-red-500 text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  {state.error}
                </div>
              )}
              {state.success && (
                <div
                  id="general-success"
                  className="text-green-500 text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {state.success}
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPending}
              aria-describedby={isPending ? "save-loading" : undefined}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span id="save-loading" className="sr-only">Saving changes, please wait...</span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

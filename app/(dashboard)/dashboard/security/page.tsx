'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { updatePassword, deleteAccount } from '@/app/(login)/actions';

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
};

export default function SecurityPage() {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, {});

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteAccount, {});

  return (
    <section className="flex-1 p-4 lg:p-8" aria-labelledby="security-page-title">
      <h1 id="security-page-title" className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Security Settings
      </h1>
      <div className="space-y-8">
        <section aria-labelledby="password-heading">
          <h2 id="password-heading" className="sr-only">
            Password Management
          </h2>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" action={passwordAction} noValidate>
                <div>
                  <Label htmlFor="current-password" className="mb-2">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength={8}
                    maxLength={100}
                    defaultValue={passwordState.currentPassword}
                    aria-describedby={passwordState.error ? "password-error" : "password-help"}
                    aria-invalid={passwordState.error ? "true" : "false"}
                  />
                </div>
                <div>
                  <Label htmlFor="new-password" className="mb-2">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={100}
                    defaultValue={passwordState.newPassword}
                    aria-describedby={passwordState.error ? "password-error" : undefined}
                    aria-invalid={passwordState.error ? "true" : "false"}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="mb-2">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    maxLength={100}
                    defaultValue={passwordState.confirmPassword}
                    aria-describedby={passwordState.error ? "password-error" : undefined}
                    aria-invalid={passwordState.error ? "true" : "false"}
                  />
                </div>
                <p id="password-help" className="sr-only">
                  Password must be at least 8 characters long and no more than 100 characters
                </p>
                
                <div className="space-y-2" role="region" aria-live="polite" aria-atomic="true">
                  {passwordState.error && (
                    <div
                      id="password-error"
                      className="text-red-500 text-sm"
                      role="alert"
                      aria-live="assertive"
                    >
                      {passwordState.error}
                    </div>
                  )}
                  {passwordState.success && (
                    <div
                      className="text-green-500 text-sm"
                      role="status"
                      aria-live="polite"
                    >
                      {passwordState.success}
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isPasswordPending}
                  aria-describedby={isPasswordPending ? "password-save-loading" : undefined}
                >
                  {isPasswordPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span id="password-save-loading" className="sr-only">
                        Updating password, please wait...
                      </span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="delete-account-heading">
          <h2 id="delete-account-heading" className="sr-only">
            Delete Account
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-red-600 font-medium" role="alert">
                  <strong>Warning:</strong> Account deletion is irreversible. Please proceed with caution.
                </p>
                <form action={deleteAction} className="space-y-4" noValidate>
                  <div>
                    <Label htmlFor="delete-password" className="mb-2">
                      Confirm Password
                    </Label>
                    <Input
                      id="delete-password"
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      maxLength={100}
                      defaultValue={deleteState.password}
                      placeholder="Enter your password to confirm deletion"
                      aria-describedby={deleteState.error ? "delete-error" : "delete-help"}
                      aria-invalid={deleteState.error ? "true" : "false"}
                    />
                    <p id="delete-help" className="sr-only">
                      Enter your current password to confirm account deletion
                    </p>
                  </div>
                  
                  <div className="space-y-2" role="region" aria-live="polite" aria-atomic="true">
                    {deleteState.error && (
                      <div
                        id="delete-error"
                        className="text-red-500 text-sm"
                        role="alert"
                        aria-live="assertive"
                      >
                        {deleteState.error}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeletePending}
                    aria-describedby={isDeletePending ? "delete-loading" : undefined}
                  >
                    {isDeletePending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        <span id="delete-loading" className="sr-only">
                          Deleting account, please wait...
                        </span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
}

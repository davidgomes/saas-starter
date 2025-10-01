'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { customerPortalAction } from '@/lib/payments/actions';
import { useActionState } from 'react';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import { removeTeamMember, inviteTeamMember } from '@/app/(login)/actions';
import useSWR from 'swr';
import { Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SubscriptionSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="animate-pulse space-y-2"
          role="status" 
          aria-label="Loading subscription information"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4" aria-hidden="true"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2" aria-hidden="true"></div>
          <div className="h-8 bg-gray-200 rounded w-32 mt-4" aria-hidden="true"></div>
        </div>
        <span className="sr-only">Loading subscription information...</span>
      </CardContent>
    </Card>
  );
}

function ManageSubscription() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">
                Current Plan: <span className="font-semibold">{teamData?.planName || 'Free'}</span>
              </p>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {teamData?.subscriptionStatus === 'active'
                  ? 'Billed monthly'
                  : teamData?.subscriptionStatus === 'trialing'
                  ? 'Trial period'
                  : 'No active subscription'}
              </p>
            </div>
            <form action={customerPortalAction}>
              <Button type="submit" variant="outline" aria-label="Manage subscription settings">
                Manage Subscription
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembersSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="animate-pulse space-y-4 mt-1"
          role="status" 
          aria-label="Loading team members"
        >
          <div className="flex items-center space-x-4">
            <div className="size-8 rounded-full bg-gray-200" aria-hidden="true"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" aria-hidden="true"></div>
              <div className="h-3 w-14 bg-gray-200 rounded" aria-hidden="true"></div>
            </div>
          </div>
        </div>
        <span className="sr-only">Loading team members...</span>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, {});

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => {
    return user.name || user.email || 'Unknown User';
  };

  if (!teamData?.teamMembers?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground" role="status" aria-live="polite">
            No team members yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          Team Members ({teamData.teamMembers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4" role="list">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {/* 
                    This app doesn't save profile images, but here
                    is how you'd show them:

                    <AvatarImage
                      src={member.user.image || ''}
                      alt={getUserDisplayName(member.user)}
                    />
                  */}
                  <AvatarFallback aria-label={`Avatar for ${getUserDisplayName(member.user)}`}>
                    {getUserDisplayName(member.user)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {getUserDisplayName(member.user)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    Role: {member.role}
                  </p>
                </div>
              </div>
              {index > 0 ? (
                <form action={removeAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isRemovePending}
                    aria-label={`Remove team member ${getUserDisplayName(member.user)}`}
                  >
                    {isRemovePending ? 'Removing...' : 'Remove'}
                  </Button>
                </form>
              ) : (
                <span className="text-sm text-muted-foreground" aria-label="Cannot remove team owner">
                  Owner
                </span>
              )}
            </li>
          ))}
        </ul>
        {removeState?.error && (
          <div
            className="text-red-500 mt-4"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {removeState.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InviteTeamMemberSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="animate-pulse space-y-4"
          role="status" 
          aria-label="Loading invite form"
        >
          <div className="h-4 bg-gray-200 rounded w-1/4" aria-hidden="true"></div>
          <div className="h-10 bg-gray-200 rounded" aria-hidden="true"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-4" aria-hidden="true"></div>
          <div className="flex space-x-4 mt-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full" aria-hidden="true"></div>
            <div className="h-4 bg-gray-200 rounded w-16" aria-hidden="true"></div>
          </div>
          <div className="flex space-x-4 mt-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full" aria-hidden="true"></div>
            <div className="h-4 bg-gray-200 rounded w-12" aria-hidden="true"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 mt-6" aria-hidden="true"></div>
        </div>
        <span className="sr-only">Loading invite team member form...</span>
      </CardContent>
    </Card>
  );
}

function InviteTeamMember() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const isOwner = user?.role === 'owner';
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email" className="mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              required
              disabled={!isOwner}
              aria-describedby={!isOwner ? "email-restriction" : undefined}
              aria-invalid={inviteState?.error ? "true" : "false"}
              autoComplete="email"
            />
          </div>
          <fieldset>
            <legend className="text-sm font-medium mb-2">Team Role</legend>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
              aria-describedby={!isOwner ? "role-restriction" : undefined}
            >
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Member</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
            </RadioGroup>
          </fieldset>
          
          <div className="space-y-2" role="region" aria-live="polite" aria-atomic="true">
            {inviteState?.error && (
              <div
                className="text-red-500 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {inviteState.error}
              </div>
            )}
            {inviteState?.success && (
              <div
                className="text-green-500 text-sm"
                role="status"
                aria-live="polite"
              >
                {inviteState.success}
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isInvitePending || !isOwner}
            aria-describedby={isInvitePending ? "submit-loading" : undefined}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                <span id="submit-loading" className="sr-only">Inviting team member, please wait...</span>
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Invite Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p 
            id="email-restriction"
            className="text-sm text-muted-foreground"
            role="alert"
            aria-live="polite"
          >
            You must be a team owner to invite new members.
          </p>
          <span id="role-restriction" className="sr-only">
            Team role selection is restricted to team owners only
          </span>
        </CardFooter>
      )}
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <section className="flex-1 p-4 lg:p-8" aria-labelledby="page-title">
      <h1 id="page-title" className="text-lg lg:text-2xl font-medium mb-6">
        Team Settings
      </h1>
      <div className="space-y-8">
        <section aria-labelledby="subscription-heading">
          <h2 id="subscription-heading" className="sr-only">
            Subscription Information
          </h2>
          <Suspense fallback={<SubscriptionSkeleton />}>
            <ManageSubscription />
          </Suspense>
        </section>
        
        <section aria-labelledby="team-members-heading">
          <h2 id="team-members-heading" className="sr-only">
            Team Members
          </h2>
          <Suspense fallback={<TeamMembersSkeleton />}>
            <TeamMembers />
          </Suspense>
        </section>
        
        <section aria-labelledby="invite-team-heading">
          <h2 id="invite-team-heading" className="sr-only">
            Invite Team Member
          </h2>
          <Suspense fallback={<InviteTeamMemberSkeleton />}>
            <InviteTeamMember />
          </Suspense>
        </section>
      </div>
    </section>
  );
}

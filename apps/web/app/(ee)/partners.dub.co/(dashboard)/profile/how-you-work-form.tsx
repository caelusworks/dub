import { updatePartnerProfileAction } from "@/lib/actions/partners/update-partner-profile";
import { hasPermission } from "@/lib/auth/partner-users/partner-user-permissions";
import { PartnerProps } from "@/lib/types";
import { Button, Check2 } from "@dub/ui";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SettingsRow } from "./settings-row";

import {
  preferredEarningStructures,
  salesChannels,
} from "@/lib/partners/partner-profile";
import { mutatePrefix } from "@/lib/swr/mutate";
import { cn } from "@dub/utils";
import { PreferredEarningStructure, SalesChannel } from "@prisma/client";

type HowYouWorkFormData = {
  preferredEarningStructures: PreferredEarningStructure[];
  salesChannels: SalesChannel[];
};

export function HowYouWorkForm({ partner }: { partner?: PartnerProps }) {
  const disabled = partner
    ? !hasPermission(partner.role, "partner_profile.update")
    : true;
  const {
    control,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<HowYouWorkFormData>({
    defaultValues: {
      preferredEarningStructures: partner?.preferredEarningStructures ?? [],
      salesChannels: partner?.salesChannels ?? [],
    },
  });

  // Reset form dirty state after submit
  useEffect(() => {
    if (isSubmitSuccessful)
      reset(getValues(), { keepValues: true, keepDirty: false });
  }, [isSubmitSuccessful, reset, getValues]);

  const { executeAsync } = useAction(updatePartnerProfileAction, {
    onSuccess: () => {
      toast.success("Your profile has been updated.");
      mutatePrefix("/api/partner-profile");
    },
    onError({ error }) {
      setError("root.serverError", {
        message: error.serverError,
      });

      toast.error(error.serverError);
    },
  });

  return (
    <div className="flex flex-col divide-y divide-border-subtle rounded-lg border border-border-subtle">
      <div className="px-6 py-8">
        <h3 className="text-lg font-semibold leading-7 text-content-emphasis">
          How you work
        </h3>
        <p className="text-sm font-normal leading-5 text-content-subtle">
          Share how you prefer to earn and promote products to help programs
          understand your style of partnership.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(async (data) => {
          await executeAsync(data);
        })}
      >
        <SettingsRow
          id="earning-structures"
          heading="Preferred earning structure"
          description="Choose how you'd like to be rewarded. Select all that apply."
        >
          <div className="@container/panel">
            <div className="grid grid-cols-1 gap-4 @sm/panel:grid-cols-2">
              <Controller
                control={control}
                name="preferredEarningStructures"
                render={({ field }) => (
                  <>
                    {preferredEarningStructures.map((earningStructure) => (
                      <label
                        key={earningStructure.id}
                        className={cn(
                          "flex cursor-pointer select-none items-center gap-2.5 rounded-full bg-white px-4 py-3 ring-1 ring-border-subtle transition-all duration-100 ease-out hover:bg-bg-muted",
                          disabled && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          disabled={disabled}
                          checked={field.value.includes(earningStructure.id)}
                          onChange={(e) =>
                            !disabled &&
                            (e.target.checked
                              ? field.onChange([
                                  ...field.value,
                                  earningStructure.id,
                                ])
                              : field.onChange(
                                  field.value.filter(
                                    (id) => id !== earningStructure.id,
                                  ),
                                ))
                          }
                        />
                        <div
                          className={cn(
                            "flex size-4 items-center justify-center rounded border border-border-default bg-content-inverted",
                            field.value.includes(earningStructure.id) &&
                              "border-content-emphasis bg-content-emphasis",
                          )}
                        >
                          <Check2
                            className={cn(
                              "size-3 text-content-inverted",
                              !field.value.includes(earningStructure.id) &&
                                "opacity-0",
                            )}
                          />
                        </div>
                        <span className="text-sm font-medium text-content-emphasis">
                          {earningStructure.label}
                        </span>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        </SettingsRow>

        <SettingsRow
          id="channels"
          heading="Sales channels"
          description="Where you promote products and links. Select all that apply."
        >
          <div className="@container/panel">
            <div className="grid grid-cols-1 gap-4 @sm/panel:grid-cols-2">
              <Controller
                control={control}
                name="salesChannels"
                render={({ field }) => (
                  <>
                    {salesChannels.map((salesChannel) => (
                      <label
                        key={salesChannel.id}
                        className={cn(
                          "flex cursor-pointer select-none items-center gap-2.5 rounded-full bg-white px-4 py-3 ring-1 ring-border-subtle transition-all duration-100 ease-out hover:bg-bg-muted",
                          disabled && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          disabled={disabled}
                          checked={field.value.includes(salesChannel.id)}
                          onChange={(e) =>
                            !disabled &&
                            (e.target.checked
                              ? field.onChange([
                                  ...field.value,
                                  salesChannel.id,
                                ])
                              : field.onChange(
                                  field.value.filter(
                                    (id) => id !== salesChannel.id,
                                  ),
                                ))
                          }
                        />
                        <div
                          className={cn(
                            "flex size-4 items-center justify-center rounded border border-border-default bg-content-inverted",
                            field.value.includes(salesChannel.id) &&
                              "border-content-emphasis bg-content-emphasis",
                          )}
                        >
                          <Check2
                            className={cn(
                              "size-3 text-content-inverted",
                              !field.value.includes(salesChannel.id) &&
                                "opacity-0",
                            )}
                          />
                        </div>
                        <span className="text-sm font-medium text-content-emphasis">
                          {salesChannel.label}
                        </span>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        </SettingsRow>

        <div className="flex items-center justify-end rounded-b-lg border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <Button
            text="Save changes"
            className="h-8 w-fit px-2.5"
            disabled={disabled}
            loading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

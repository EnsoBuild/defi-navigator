#!/bin/bash

# Create the new directory structure
mkdir -p lib/components/common
mkdir -p lib/components/layout
mkdir -p lib/components/feedback
mkdir -p lib/components/tokens
mkdir -p lib/components/filters/ui
mkdir -p lib/components/filters/cli
mkdir -p lib/components/filters/shared
mkdir -p lib/components/icons
mkdir -p lib/hooks
mkdir -p lib/types
mkdir -p lib/services/api
mkdir -p lib/services/filters
mkdir -p lib/services/utils
mkdir -p lib/stores
mkdir -p lib/utils
mkdir -p lib/constants

# Move common components
mv lib/components/core/Button.svelte lib/components/common/
mv lib/components/core/Card.svelte lib/components/common/
mv lib/components/core/Input.svelte lib/components/common/
mv lib/components/core/Select.svelte lib/components/common/
mv lib/components/core/QuestionIcon.svelte lib/components/icons/
mv lib/components/core/ShareFiltersButton.svelte lib/components/common/

# Move layout components
mv lib/components/layout/Modal.svelte lib/components/layout/
mv lib/components/layout/FilterBar.svelte lib/components/layout/
mv lib/components/Nav.svelte lib/components/layout/
mv lib/components/ModeSwitchButton.svelte lib/components/common/

# Move feedback components
mv lib/components/feedback/LoadingSpinner.svelte lib/components/feedback/
mv lib/components/feedback/EmptyState.svelte lib/components/feedback/
mv lib/components/feedback/SkeletonLoader.svelte lib/components/feedback/

# Move token components
mv lib/components/TokenExplorer.svelte lib/components/tokens/
mv lib/components/TokenList.svelte lib/components/tokens/
mv lib/components/composite/TokenCard.svelte lib/components/tokens/
mv lib/components/composite/TokenDetails.svelte lib/components/tokens/
mv lib/components/composite/TokenLogo.svelte lib/components/tokens/
mv lib/components/composite/TokenSearch.svelte lib/components/tokens/
mv lib/components/composite/AddressPill.svelte lib/components/tokens/
mv lib/components/composite/ChainBadge.svelte lib/components/tokens/
mv lib/components/composite/CopyButton.svelte lib/components/common/
mv lib/components/composite/MetricCard.svelte lib/components/common/
mv lib/components/composite/ResultsStats.svelte lib/components/tokens/
mv lib/components/composite/SuggestionsList.svelte lib/components/filters/shared/
mv lib/components/composite/UnderlyingTokenItem.svelte lib/components/tokens/
mv lib/components/composite/SearchHelpDialog.svelte lib/components/filters/shared/

# Move filter components
mv lib/components/filter/FilterSystem.svelte lib/components/filters/
mv lib/components/filter/ui/FilterUI.svelte lib/components/filters/ui/
mv lib/components/filter/ui/FilterBuilder.svelte lib/components/filters/ui/
mv lib/components/filter/ui/FilterDropdown.svelte lib/components/filters/ui/
mv lib/components/filter/ui/FilterInput.svelte lib/components/filters/ui/
mv lib/components/filter/ui/FilterPill.svelte lib/components/filters/ui/
mv lib/components/filter/ui/FilterRangeInput.svelte lib/components/filters/ui/
mv lib/components/filter/ui/FilterSuggestions.svelte lib/components/filters/ui/
mv lib/components/filter/cli/FilterCLI.svelte lib/components/filters/cli/
mv lib/components/filter/cli/SearchHelpDialog.svelte lib/components/filters/cli/
mv lib/components/filter/shared/FilterPill.svelte lib/components/filters/shared/
mv lib/components/filter/shared/SuggestionList.svelte lib/components/filters/shared/

# Move types
mv lib/types/api.ts lib/types/
mv lib/types/index.ts lib/types/
# Create filters.ts type definition
touch lib/types/filters.ts

# Move API services
mv lib/api/tokens.ts lib/services/api/
touch lib/services/api/index.ts

# Move services
mv lib/services/tokenService.ts lib/services/
mv lib/services/filterEngine.ts lib/services/filters/
mv lib/services/filterSuggestionService.ts lib/services/filters/

# Move search utilities to utils folder
mv lib/search/parser.ts lib/utils/
mv lib/search/url.ts lib/utils/
mv lib/search/web.ts lib/utils/
mv lib/search/filters.ts lib/constants/filters.ts

# Move stores
mv lib/stores/filterStore.ts lib/stores/

# Create utility files
touch lib/utils/formatting.ts
touch lib/utils/validation.ts
touch lib/utils/misc.ts

# Create constants files
touch lib/constants/api.ts
touch lib/constants/ui.ts

# Create main exports file
touch lib/index.ts

# Clean up empty directories
find lib -type d -empty -delete

echo "File reorganization complete!"
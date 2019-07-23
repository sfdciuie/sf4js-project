#!/bin/bash

# Get parameters
ORG_ALIAS="conf"

# Install script
echo ""
echo "Installing conf management scratch org:"
echo "- Org alias:      $ORG_ALIAS"
echo ""

echo "Cleaning previous scratch org..."
sfdx force:org:delete -p -u $ORG_ALIAS &> /dev/null
echo ""

echo "Creating scratch org..."
sfdx force:org:create -s -f config/project-scratch-def.json -a $ORG_ALIAS -d 30 && \
echo "" && \

echo "Pushing sources..." && \
sfdx force:source:push -u $ORG_ALIAS && \
echo "" && \

echo "Assigning permission sets..." && \
sfdx force:user:permset:assign -n Conference_Management -u $ORG_ALIAS && \
sfdx force:user:permset:assign -n Conference_Management_Completed -u $ORG_ALIAS && \
echo "" && \

echo "Importing data..." && \
sfdx force:data:tree:import -p data/plan.json -u $ORG_ALIAS && \
echo ""
EXIT_CODE="$?"


# Check exit code
echo ""
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "Installation completed."
  echo ""
  echo "Please follow the readme for a few required manual operations."
  echo ""
  sfdx force:org:open -p /lightning/setup/NavigationMenus/home
else
    echo "Installation failed."
fi
exit $EXIT_CODE

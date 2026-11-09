await sn_atf.navigate('/x_enno_pivot')

const libraryButton = await screen.findBySelector('.navbtn[data-view="Capability Library"]')
await user.click(libraryButton)

const mappingButton = await screen.findByRole('button', { name: /^Needs mapping/ })
await user.click(mappingButton)

for (const name of [
    'ATF mapping capability one',
    'ATF mapping capability two',
    'ATF mapping capability three',
]) {
    const checkbox = await screen.findByRole('checkbox', { name: 'Select ' + name, exact: true })
    await user.click(checkbox)
}

const family = screen.getBySelector('#mapFamily')
await user.selectOptions(family, ['itsm'])

const applyButton = await screen.findByRole('button', { name: 'Set family for 3 selected', exact: true })
await user.click(applyButton)

for (const name of [
    'ATF mapping capability one',
    'ATF mapping capability two',
    'ATF mapping capability three',
]) {
    await waitFor(async () => expect(await screen.queryByText(name, { exact: true })).toBeNull())
}

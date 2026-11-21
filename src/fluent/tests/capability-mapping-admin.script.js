await sn_atf.navigate('/x_enno_pivot')

const libraryButton = await screen.findBySelector('.navbtn[data-view="Capability Library"]')
await user.click(libraryButton)

const mappingButton = await screen.findByRole('button', { name: /^Needs mapping \(\d+\)$/ })
const mappingCountMatch = mappingButton.textContent.match(/\((\d+)\)/)
expect(mappingCountMatch).toBeTruthy()
const mappingCount = Number(mappingCountMatch[1])
expect(mappingCount).toBeGreaterThanOrEqual(6)

const assertDialogHasExactCount = async () => {
    const checkboxes = await screen.findAllByRole('checkbox')
    expect(checkboxes.length - 1).toBe(mappingCount)
    for (const name of [
        'ATF mapping capability one',
        'ATF mapping capability two',
        'ATF mapping capability three',
        'ATF mapping capability four',
        'ATF mapping capability five',
        'ATF mapping capability six',
    ]) {
        await screen.findByRole('checkbox', { name: 'Select ' + name, exact: true })
    }
}

await user.click(mappingButton)
await assertDialogHasExactCount()
await user.click(await screen.findByRole('button', { name: 'Close dialog', exact: true }))

const dashboardButton = await screen.findBySelector('.navbtn[data-view="Dashboard"]')
await user.click(dashboardButton)
const dashboardMappingItem = await screen.findByRole('button', {
    name: mappingCount + ' capabilities need a product family',
    exact: true,
})
await user.click(dashboardMappingItem)
await assertDialogHasExactCount()
await user.click(await screen.findByRole('button', { name: 'Close dialog', exact: true }))

await user.click(await screen.findBySelector('#notificationTrigger'))
const notificationMappingItem = await screen.findByRole('button', {
    name: new RegExp(mappingCount + ' capabilities need a product family'),
})
await user.click(notificationMappingItem)
await assertDialogHasExactCount()
await user.click(await screen.findByRole('button', { name: 'Close dialog', exact: true }))
await user.click(await screen.findBySelector('#notificationClose'))

await user.click(await screen.findBySelector('.navbtn[data-view="Capability Library"]'))
await user.click(await screen.findByRole('button', { name: 'Needs mapping (' + mappingCount + ')', exact: true }))

for (const name of [
    'ATF mapping capability one',
    'ATF mapping capability two',
    'ATF mapping capability three',
    'ATF mapping capability four',
    'ATF mapping capability five',
    'ATF mapping capability six',
]) {
    const checkbox = await screen.findByRole('checkbox', { name: 'Select ' + name, exact: true })
    await user.click(checkbox)
}

const family = screen.getBySelector('#mapFamily')
await user.selectOptions(family, ['itsm'])

const applyButton = await screen.findByRole('button', { name: 'Set family for 6 selected', exact: true })
await user.click(applyButton)

for (const name of [
    'ATF mapping capability one',
    'ATF mapping capability two',
    'ATF mapping capability three',
    'ATF mapping capability four',
    'ATF mapping capability five',
    'ATF mapping capability six',
]) {
    await waitFor(async () => expect(await screen.queryByText(name, { exact: true })).toBeNull())
}

if (mappingCount === 6) {
    await screen.findByText('Every capability has a product family.', { exact: true })
}

# Contributing | 参与贡献

Thank you for your interest in contributing! 感谢你的关注和贡献！

## How to Contribute | 如何贡献

### Adding Vocabulary | 添加词汇

1. Edit `EnglishLearning_BP/scripts/vocabulary.js`
2. Add entries following the existing format:

```javascript
{ id: "minecraft:entity_id", en: "ENGLISH NAME", cn: "中文名", phonetic: "/fəˈnetɪk/" }
```

3. Make sure the `id` matches the **Bedrock Edition** entity/block ID (may differ from Java Edition)
4. Add the phonetic transcription using IPA symbols

### Adding a New Language | 添加新语言

1. Fork the repository
2. In `vocabulary.js`, add a new property to each entry (e.g., `ja` for Japanese, `ko` for Korean)
3. Update the display functions in `proximity.js` and `blockLearn.js` to show the new language
4. Update `README.md` with the new language info
5. Submit a Pull Request

### Testing | 测试

- Test on BDS 1.21.60+ (or latest)
- Test on single player (Windows, Android, iOS if possible)
- Verify that proximity detection works correctly
- Check that progress saves and loads properly across sessions

### Reporting Issues | 报告问题

- Use GitHub Issues
- Include: Minecraft version, platform, steps to reproduce, expected vs actual behavior
- Screenshots or videos are very helpful!

## Code Style | 代码规范

- Comments in English
- User-facing strings in bilingual (EN + CN)
- Use `async/await` for `runCommandAsync` calls
- Always `try/catch` command executions to prevent script crashes
- Keep modules focused — one responsibility per file

## License | 许可

By contributing, you agree that your contributions will be licensed under the MIT License.
